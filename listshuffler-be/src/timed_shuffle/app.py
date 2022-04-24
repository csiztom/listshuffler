import logging

try:
    from helpers import rds_config, shuffle
except:  # for testing inside different root
    from ..helpers import rds_config, shuffle

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    This shuffles lists which have been set a shuffle time
    """
    
    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID from public.instances where shuffleTime < CURDATE()")
        for adminId in cur.fetchall():
            try: 
                shuffle.shuffle(adminId, conn)
                logger.info("Success: Shuffle completed")
            except: 
                logger.info("ERROR: Shuffle failed")
                pass
