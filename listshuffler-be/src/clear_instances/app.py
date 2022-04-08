try:
    from helpers import rds_config
except:  # for testing inside different root
    from ..helpers import rds_config


def handler(event, context):
    """
    This function clears expired instances
    """
    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute("SET SQL_SAFE_UPDATES = 0")
        cur.execute("DELETE FROM public.instances where expiration < CURDATE()")
        conn.commit()
