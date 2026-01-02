from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./vaultpay.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


class Vault(Base):
    __tablename__ = "vaults"

    wallet_address = Column(String, primary_key=True, index=True)
    vault_address = Column(String, nullable=False)



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    wallet_address = Column(String, unique=True, index=True, nullable=True)
    private_key = Column(String, nullable=True) # Custodial wallet support
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=1)  # 1 for active, 0 for inactive


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    tx_hash = Column(String, nullable=False)  # Removed unique=True to allow SEND/RECEIVE pairs
    type = Column(String, nullable=False)  # DEPOSIT, WITHDRAW, SEND, RECEIVE
    amount = Column(String, nullable=False)
    currency = Column(String, default="USD")
    status = Column(String, default="PENDING")
    created_at = Column(DateTime, default=datetime.utcnow)

class SystemConfig(Base):
    __tablename__ = "system_config"
    
    key = Column(String, primary_key=True, index=True)
    value = Column(String)

def init_db():
    Base.metadata.create_all(bind=engine)
