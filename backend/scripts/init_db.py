from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine = create_engine("postgresql://testuser:testcredentials@db:5432/memecoins")

class Coin(Base):
    __tablename__ = "coins"
    id = Column(Integer, primary_key=True)
    ticker = Column(String)
    name = Column(String)
    contract_address = Column(String)

Base.metadata.create_all(engine)