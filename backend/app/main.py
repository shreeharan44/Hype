from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .services.blockchain import (
    deploy_token, deploy_shared_vault,
    mint_token, approve_user, revoke_user,
    deposit_to_shared_vault, withdraw_from_shared_vault,
    get_vault_balance, get_token_balance, create_wallet,
    fund_user_wallet, transfer_between_users, send_eth_from_key, PUBLIC_ADDRESS
)

from .database import SessionLocal, init_db, User, Transaction, SystemConfig
from .auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_user, get_db
)

# Initialize DB
init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class DeployTokenModel(BaseModel):
    name: str
    symbol: str
    supply: int

class DeployVaultModel(BaseModel):
    token_address: str

class AdminActionModel(BaseModel):
    user_username: str

class MintModel(BaseModel):
    user_username: str
    amount: float

class DepositRequest(BaseModel):
    amount: float
    currency: str = "USD"

class WithdrawRequest(BaseModel):
    amount: float
    currency: str = "USD"

class SendPaymentRequest(BaseModel):
    recipient_username: str
    amount: float

class UserRegister(BaseModel):
    email: str
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str
    wallet_address: Optional[str] = None

class PaymentResponse(BaseModel):
    success: bool
    message: str
    transaction_hash: str = None
    balance: int = None

# Helper Functions
FIAT_TO_USDC = {
    "INR": 0.01128,
    "AED": 0.27,
    "USD": 1,
    "EUR": 1.08,
    "GBP": 1.27,
    "CAD": 0.73
}

def convert_fiat(currency, amount):
    rate = FIAT_TO_USDC.get(currency.upper())
    if not rate:
        raise ValueError("Unsupported currency")
    return amount * rate

def get_system_config(key: str, db: Session):
    config = db.query(SystemConfig).filter(SystemConfig.key == key).first()
    return config.value if config else None

def set_system_config(key: str, value: str, db: Session):
    config = db.query(SystemConfig).filter(SystemConfig.key == key).first()
    if config:
        config.value = value
    else:
        config = SystemConfig(key=key, value=value)
        db.add(config)
    db.commit()

# -----------------------------------
# Admin Endpoints
# -----------------------------------

@app.post("/admin/deploy-token")
def api_deploy_token(body: DeployTokenModel, db: Session = Depends(get_db)):
    try:
        addr = deploy_token(body.name, body.symbol, body.supply)
        set_system_config("TOKEN_ADDRESS", addr, db)
        return {"tokenAddress": addr}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/deploy-vault")
def api_deploy_vault(body: DeployVaultModel, db: Session = Depends(get_db)):
    try:
        addr = deploy_shared_vault(body.token_address)
        set_system_config("VAULT_ADDRESS", addr, db)
        return {"vaultAddress": addr}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/approve-user")
def api_approve_user(body: AdminActionModel, db: Session = Depends(get_db)):
    vault_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    if not vault_address:
        raise HTTPException(400, "Vault not deployed")
    
    user = db.query(User).filter(User.username == body.user_username).first()
    if not user or not user.wallet_address:
        raise HTTPException(404, "User not found or has no wallet")

    try:
        tx = approve_user(vault_address, user.wallet_address)
        return {"success": True, "tx": tx}
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/admin/revoke-user")
def api_revoke_user(body: AdminActionModel, db: Session = Depends(get_db)):
    vault_address = get_system_config("VAULT_ADDRESS", db)
    if not vault_address:
        raise HTTPException(400, "Vault not deployed")
    
    user = db.query(User).filter(User.username == body.user_username).first()
    if not user or not user.wallet_address:
        raise HTTPException(404, "User not found or has no wallet")

    try:
        tx = revoke_user(vault_address, user.wallet_address)
        return {"success": True, "tx": tx}
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/admin/mint")
def api_mint(body: MintModel, db: Session = Depends(get_db)):
    token_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    if not token_address:
        raise HTTPException(400, "Token not deployed")
    
    user = db.query(User).filter(User.username == body.user_username).first()
    if not user or not user.wallet_address:
        raise HTTPException(404, "User not found or has no wallet")

    try:
        # Mint tokens
        amount_wei = int(body.amount * (10 ** 18))
        tx = mint_token(token_address, user.wallet_address, amount_wei)
        
        # Send 1 ETH from specified private key to user
        eth_private_key = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
        eth_tx = send_eth_from_key(eth_private_key, user.wallet_address, 1.0)
        
        return {
            "success": True, 
            "tx": tx, 
            "amount": body.amount,
            "eth_transfer_tx": eth_tx,
            "eth_sent": 1.0
        }
    except Exception as e:
        raise HTTPException(500, str(e))

# -----------------------------------
# Payment Endpoints
# -----------------------------------

@app.post("/payment/deposit", response_model=PaymentResponse)
def deposit_money(
    deposit: DepositRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vault_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    token_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    
    if not vault_address or not token_address:
        raise HTTPException(500, "System not configured (Vault/Token missing)")
    
    if not current_user.private_key:
         raise HTTPException(400, "User has no wallet (private key missing)")

    try:
        usdc_amount = convert_fiat(deposit.currency, deposit.amount)
        amount_wei = int(usdc_amount * (10 ** 18))
        
        # Check token balance first
        token_bal = get_token_balance(token_address, current_user.wallet_address)
        if token_bal < amount_wei:
             raise HTTPException(400, f"Insufficient token balance. You have {token_bal/10**18}, need {amount_wei/10**18}. Ask admin to mint.")

        tx_hash = deposit_to_shared_vault(
            vault_address, 
            token_address, 
            current_user.private_key, 
            amount_wei
        )
        
        # Log transaction
        new_tx = Transaction(
            user_id=current_user.id,
            tx_hash=tx_hash,
            type="DEPOSIT",
            amount=str(deposit.amount),
            currency=deposit.currency,
            status="CONFIRMED"
        )
        db.add(new_tx)
        db.commit()

        new_balance = get_vault_balance(vault_address, current_user.wallet_address)

        return {
            "success": True,
            "message": f"Deposited {deposit.amount} {deposit.currency}",
            "transaction_hash": tx_hash,
            "balance": new_balance
        }

    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/payment/withdraw", response_model=PaymentResponse)
def withdraw_money(
    withdraw: WithdrawRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vault_address ="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    if not vault_address:
        raise HTTPException(500, "Vault not deployed")
        
    if not current_user.private_key:
         raise HTTPException(400, "User has no wallet")

    try:
        usdc_amount = convert_fiat(withdraw.currency, withdraw.amount)
        amount_wei = int(usdc_amount * (10 ** 18))
        
        tx_hash = withdraw_from_shared_vault(
            vault_address,
            current_user.private_key,
            amount_wei
        )
        
        new_tx = Transaction(
            user_id=current_user.id,
            tx_hash=tx_hash,
            type="WITHDRAW",
            amount=str(withdraw.amount),
            currency=withdraw.currency,
            status="CONFIRMED"
        )
        db.add(new_tx)
        db.commit()
        
        new_balance = get_vault_balance(vault_address, current_user.wallet_address)
        
        return {
            "success": True,
            "message": f"Withdrew {withdraw.amount} {withdraw.currency}",
            "transaction_hash": tx_hash,
            "balance": new_balance
        }

    except Exception as e:
        raise HTTPException(500, str(e))

@app.get("/payment/balance")
def get_balance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        vault_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        token_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        
        if not vault_address:
            raise HTTPException(500, "Vault not deployed yet")
        
        # Get vault balance (tokens deposited in shared vault)
        vault_balance_wei = get_vault_balance(vault_address, current_user.wallet_address)
        vault_balance_usd = vault_balance_wei / (10 ** 18)
        
        # Get token balance (tokens in user's wallet)
        token_balance_wei = get_token_balance(token_address, current_user.wallet_address)
        token_balance_usd = token_balance_wei / (10 ** 18)
        
        return {
            "balance": vault_balance_wei,  # Vault balance in wei (for backward compatibility)
            "balance_usd": vault_balance_usd,  # Vault balance in USD
            "vault_address": vault_address,
            "vault_balance_wei": vault_balance_wei,  # Explicit vault balance
            "vault_balance_usd": vault_balance_usd,
            "token_balance_wei": token_balance_wei,  # Wallet token balance
            "token_balance_usd": token_balance_usd,  # Wallet token balance in USD
            "total_balance_usd": vault_balance_usd + token_balance_usd  # Combined total
        }
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/payment/send")
def send_payment(
    request: SendPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send tokens to another user via username"""
    try:
        # Find recipient
        recipient = db.query(User).filter(User.username == request.recipient_username).first()
        if not recipient:
            raise HTTPException(404, f"User '{request.recipient_username}' not found")
        
        if recipient.id == current_user.id:
            raise HTTPException(400, "Cannot send tokens to yourself")
        
        # Get vault address
        vault_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        if not vault_address:
            raise HTTPException(500, "Vault not deployed yet")
        
        # Check sender balance
        sender_balance = get_vault_balance(vault_address, current_user.wallet_address)
        amount_wei = int(request.amount * (10 ** 18))
        
        if sender_balance < amount_wei:
            raise HTTPException(400, f"Insufficient balance. You have {sender_balance / (10**18)} tokens")
        
        # Execute transfer (admin signs the transaction)
        tx_hash = transfer_between_users(
            vault_address,
            current_user.wallet_address,
            recipient.wallet_address,
            request.amount
        )
        
        # Log transaction for sender
        sender_transaction = Transaction(
            user_id=current_user.id,
            tx_hash=tx_hash,
            type="SEND",
            amount=str(request.amount),
            currency="USD",
            status="CONFIRMED"
        )
        db.add(sender_transaction)
        
        # Log transaction for recipient
        recipient_transaction = Transaction(
            user_id=recipient.id,
            tx_hash=tx_hash,
            type="RECEIVE",
            amount=str(request.amount),
            currency="USD",
            status="CONFIRMED"
        )
        db.add(recipient_transaction)
        db.commit()
        
        # Get new balance
        new_balance = get_vault_balance(vault_address, current_user.wallet_address)
        
        return {
            "success": True,
            "message": f"Sent {request.amount} tokens to {recipient.username}",
            "transaction_hash": tx_hash,
            "recipient": recipient.username,
            "recipient_wallet": recipient.wallet_address,
            "balance": new_balance,
            "balance_usd": new_balance / (10 ** 18)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))

@app.get("/payment/transactions")
def get_transaction_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's transaction history with recipient/sender usernames"""
    try:
        # Get all transactions for current user
        transactions = db.query(Transaction).filter(
            Transaction.user_id == current_user.id
        ).order_by(Transaction.created_at.desc()).all()
        
        history = []
        for tx in transactions:
            # Base transaction info
            tx_info = {
                "id": tx.id,
                "type": tx.type,
                "amount": float(tx.amount),
                "currency": tx.currency,
                "status": tx.status,
                "tx_hash": tx.tx_hash,
                "created_at": tx.created_at.isoformat()
            }
            
            # For SEND transactions, find recipient
            if tx.type == "SEND":
                # Find the RECEIVE transaction with same tx_hash
                receive_tx = db.query(Transaction).filter(
                    Transaction.tx_hash == tx.tx_hash,
                    Transaction.type == "RECEIVE"
                ).first()
                
                if receive_tx:
                    recipient = db.query(User).filter(User.id == receive_tx.user_id).first()
                    if recipient:
                        tx_info["recipient_username"] = recipient.username
                        tx_info["recipient_wallet"] = recipient.wallet_address
                        tx_info["direction"] = "sent"
            
            # For RECEIVE transactions, find sender
            elif tx.type == "RECEIVE":
                # Find the SEND transaction with same tx_hash
                send_tx = db.query(Transaction).filter(
                    Transaction.tx_hash == tx.tx_hash,
                    Transaction.type == "SEND"
                ).first()
                
                if send_tx:
                    sender = db.query(User).filter(User.id == send_tx.user_id).first()
                    if sender:
                        tx_info["sender_username"] = sender.username
                        tx_info["sender_wallet"] = sender.wallet_address
                        tx_info["direction"] = "received"
            
            # For DEPOSIT/WITHDRAW, just mark the direction
            elif tx.type == "DEPOSIT":
                tx_info["direction"] = "deposited"
            elif tx.type == "WITHDRAW":
                tx_info["direction"] = "withdrawn"
            
            history.append(tx_info)
        
        return {
            "total": len(history),
            "transactions": history
        }
    except Exception as e:
        raise HTTPException(500, str(e))

# -----------------------------------
# Auth Endpoints
# -----------------------------------

@app.post("/auth/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(400, "Email or username already registered")
    
    # Create Wallet
    wallet_addr, private_key = create_wallet()
    
    # Fund wallet with ETH for gas
    try:
        fund_user_wallet(wallet_addr, 0.1)
    except Exception as e:
        print(f"Warning: Failed to fund wallet: {e}")

    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email.lower().strip(),
        username=user_data.username.strip(),
        hashed_password=hashed_password,
        wallet_address=wallet_addr,
        private_key=private_key
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": new_user.id,
        "username": new_user.username,
        "wallet_address": new_user.wallet_address
    }

@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect username or password")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
        "wallet_address": user.wallet_address
    }

@app.get("/auth/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "wallet_address": current_user.wallet_address
    }
