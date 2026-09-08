from app.core.database import SessionLocal, engine, Base
from app.models.domain import *
from app.services.seed_service import seed_demo_database
from app.core.logging import logger

def init_db():
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        logger.info("Seeding demo dataset 'Hyderabad Infrastructure Ltd'...")
        seed_demo_database(db)
        logger.info("Database successfully initialized and seeded!")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
