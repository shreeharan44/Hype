import os, json, traceback
from web3 import Web3
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

RPC_URL = os.getenv("RPC_URL", "http://127.0.0.1:8545")
PRIVATE_KEY = os.getenv("PRIVATE_KEY") # Admin Private Key
PUBLIC_ADDRESS = os.getenv("PUBLIC_ADDRESS") # Admin Public Address

# Get the directory where this file is located
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Use relative paths from this file - works on any system
TOKEN_ARTIFACT = os.path.join(CURRENT_DIR, "..", "abi", "MyToken.json")
VAULT_ARTIFACT = os.path.join(CURRENT_DIR, "..", "abi", "TokenVault.json")


w3 = Web3(Web3.HTTPProvider(RPC_URL))

if not w3.is_connected():
    raise RuntimeError("Could not connect to Hardhat node at " + RPC_URL)

def load_artifact(path):
    with open(path) as f:
        return json.load(f)

token_art = load_artifact(TOKEN_ARTIFACT)
vault_art = load_artifact(VAULT_ARTIFACT)

TOKEN_ABI = token_art["abi"]
TOKEN_BYTECODE = token_art.get("bytecode") or token_art.get("evm", {}).get("bytecode", {}).get("object")
VAULT_ABI = vault_art["abi"]
VAULT_BYTECODE = vault_art.get("bytecode") or vault_art.get("evm", {}).get("bytecode", {}).get("object")

def sign_and_send(tx, private_key=PRIVATE_KEY):
    signed = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    return tx_hash.hex()

def wait_receipt(tx_hash_hex, timeout=120):
    return w3.eth.wait_for_transaction_receipt(tx_hash_hex, timeout=timeout)

def to_wei(amount):
    return int(float(amount) * 10**18)

def from_wei(amount):
    return float(amount) / 10**18

# ---------------------------------------------------------------------
# Contract Instances
# ---------------------------------------------------------------------
def token_contract(token_address):
    return w3.eth.contract(address=Web3.to_checksum_address(token_address), abi=TOKEN_ABI)

def vault_contract(vault_address):
    return w3.eth.contract(address=Web3.to_checksum_address(vault_address), abi=VAULT_ABI)

# ---------------------------------------------------------------------
# Admin Functions
# ---------------------------------------------------------------------

def deploy_token(name: str, symbol: str, initial_supply: int):
    try:
        contract = w3.eth.contract(abi=TOKEN_ABI, bytecode=TOKEN_BYTECODE)
        nonce = w3.eth.get_transaction_count(PUBLIC_ADDRESS)
        tx = contract.constructor(name, symbol, initial_supply).build_transaction({
            "from": PUBLIC_ADDRESS,
            "nonce": nonce,
            "gas": 3_000_000,
            "gasPrice": w3.eth.gas_price,
            "chainId": w3.eth.chain_id
        })
        tx_hash = sign_and_send(tx)
        receipt = wait_receipt(tx_hash)
        return receipt.contractAddress
    except Exception as e:
        raise RuntimeError("deploy_token failed: " + str(e) + "\n" + traceback.format_exc())

def deploy_shared_vault(token_address: str):
    try:
        contract = w3.eth.contract(abi=VAULT_ABI, bytecode=VAULT_BYTECODE)
        nonce = w3.eth.get_transaction_count(PUBLIC_ADDRESS)
        tx = contract.constructor(token_address).build_transaction({
            "from": PUBLIC_ADDRESS,
            "nonce": nonce,
            "gas": 3_000_000,
            "gasPrice": w3.eth.gas_price,
            "chainId": w3.eth.chain_id
        })
        tx_hash = sign_and_send(tx)
        receipt = wait_receipt(tx_hash)
        return receipt.contractAddress
    except Exception as e:
        raise RuntimeError("deploy_shared_vault failed: " + str(e) + "\n" + traceback.format_exc())

def mint_token(token_address, to_address, amount_wei):
    token = token_contract(token_address)
    nonce = w3.eth.get_transaction_count(PUBLIC_ADDRESS)
    tx = token.functions.mint(to_address, amount_wei).build_transaction({
        "from": PUBLIC_ADDRESS, "nonce": nonce, "gas": 200_000, "gasPrice": w3.eth.gas_price, "chainId": w3.eth.chain_id
    })
    return sign_and_send(tx)

def approve_user(vault_address, user_address):
    vault = vault_contract(vault_address)
    nonce = w3.eth.get_transaction_count(PUBLIC_ADDRESS)
    tx = vault.functions.approveUser(user_address).build_transaction({
        "from": PUBLIC_ADDRESS, "nonce": nonce, "gas": 100_000, "gasPrice": w3.eth.gas_price, "chainId": w3.eth.chain_id
    })
    return sign_and_send(tx)

def revoke_user(vault_address, user_address):
    vault = vault_contract(vault_address)
    nonce = w3.eth.get_transaction_count(PUBLIC_ADDRESS)
    tx = vault.functions.revokeUser(user_address).build_transaction({
        "from": PUBLIC_ADDRESS, "nonce": nonce, "gas": 100_000, "gasPrice": w3.eth.gas_price, "chainId": w3.eth.chain_id
    })
    return sign_and_send(tx)

# ---------------------------------------------------------------------
# User Functions (Custodial - Signed by User Private Key)
# ---------------------------------------------------------------------

def deposit_to_shared_vault(vault_address, token_address, user_private_key, amount_wei):
    account = w3.eth.account.from_key(user_private_key)
    user_address = account.address
    
    # 1. Approve Vault to spend Token
    token = token_contract(token_address)
    nonce = w3.eth.get_transaction_count(user_address)
    
    approve_tx = token.functions.approve(vault_address, amount_wei).build_transaction({
        "from": user_address, "nonce": nonce, "gas": 100_000, "gasPrice": w3.eth.gas_price, "chainId": w3.eth.chain_id
    })
    approve_hash = sign_and_send(approve_tx, user_private_key)
    wait_receipt(approve_hash)
    
    # 2. Deposit to Vault
    vault = vault_contract(vault_address)
    nonce = w3.eth.get_transaction_count(user_address) # Update nonce
    
    deposit_tx = vault.functions.deposit(amount_wei).build_transaction({
        "from": user_address, "nonce": nonce, "gas": 200_000, "gasPrice": w3.eth.gas_price, "chainId": w3.eth.chain_id
    })
    deposit_hash = sign_and_send(deposit_tx, user_private_key)
    
    return deposit_hash

def withdraw_from_shared_vault(vault_address, user_private_key, amount_wei):
    account = w3.eth.account.from_key(user_private_key)
    user_address = account.address
    
    vault = vault_contract(vault_address)
    nonce = w3.eth.get_transaction_count(user_address)
    
    withdraw_tx = vault.functions.withdraw(amount_wei).build_transaction({
        "from": user_address, "nonce": nonce, "gas": 200_000, "gasPrice": w3.eth.gas_price, "chainId": w3.eth.chain_id
    })
    withdraw_hash = sign_and_send(withdraw_tx, user_private_key)
    
    return withdraw_hash

def get_vault_balance(vault_address, user_address):
    vault = vault_contract(vault_address)
    return vault.functions.balances(user_address).call()

def get_token_balance(token_address, user_address):
    token = token_contract(token_address)
    return token.functions.balanceOf(user_address).call()

def create_wallet():
    account = w3.eth.account.create()
    return account.address, account.key.hex()

def transfer_between_users(vault_address: str, from_address: str, to_address: str, amount: float):
    """Admin transfers tokens between users within vault (no external token movement)"""
    try:
        vault = w3.eth.contract(address=vault_address, abi=VAULT_ABI)
        amount_wei = int(amount * (10 ** 18))
        
        nonce = w3.eth.get_transaction_count(PUBLIC_ADDRESS)
        gas_price = w3.eth.gas_price
        
        tx = vault.functions.transferBetweenUsers(
            from_address, to_address, amount_wei
        ).build_transaction({
            "from": PUBLIC_ADDRESS,
            "nonce": nonce,
            "gas": 200000,
            "gasPrice": gas_price,
            "chainId": w3.eth.chain_id
        })
        
        tx_hash = sign_and_send(tx)
        wait_receipt(tx_hash)
        return tx_hash
    except Exception as e:
        print(f"Error transferring between users: {e}")
        raise e

def fund_user_wallet(user_address: str, amount_eth: float = 1.0):
    """Fund a user's wallet with ETH from the admin account"""
    try:
        nonce = w3.eth.get_transaction_count(PUBLIC_ADDRESS)
        tx = {
            'nonce': nonce,
            'to': user_address,
            'value': w3.to_wei(amount_eth, 'ether'),
            'gas': 21000,
            'gasPrice': w3.eth.gas_price,
            'chainId': w3.eth.chain_id
        }
        tx_hash = sign_and_send(tx)
        wait_receipt(tx_hash)
        return tx_hash
    except Exception as e:
        print(f"Error funding wallet: {e}")
        raise e

def send_eth_from_key(from_private_key: str, to_address: str, amount_eth: float = 1.0):
    """Send ETH from a specific private key to an address"""
    try:
        account = w3.eth.account.from_key(from_private_key)
        from_address = account.address
        
        nonce = w3.eth.get_transaction_count(from_address)
        tx = {
            'nonce': nonce,
            'to': to_address,
            'value': w3.to_wei(amount_eth, 'ether'),
            'gas': 21000,
            'gasPrice': w3.eth.gas_price,
            'chainId': w3.eth.chain_id
        }
        tx_hash = sign_and_send(tx, from_private_key)
        wait_receipt(tx_hash)
        return tx_hash
    except Exception as e:
        print(f"Error sending ETH: {e}")
        raise e
