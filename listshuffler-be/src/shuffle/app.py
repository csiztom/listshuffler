import logging
import json
import os
import random

try:
    from helpers import rds_config
except:  # for testing inside different root
    from ..helpers import rds_config

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def pairUp(lists, listId1, listId2, multiplicity, i, used):
    if i >= len(lists[listId1]):
        return 0
    listItemId, probs = list(
        enumerate(lists[listId1].items()))[i][1]
    probs = probs[listId2][multiplicity]['probs']
    j = 0
    while True:
        if not j < len(probs):
            break
        if probs[j] in used:
            j += 1
            continue
        lists[listId1][listItemId][listId2][multiplicity]['pair'] = probs[j]
        used.append(probs[j])
        ret = pairUp(lists, listId1, listId2, multiplicity, i+1, used)
        if ret == 0:
            return 0
        del lists[listId1][listItemId][listId2][multiplicity]['pair']
        used.remove(probs[j])
        j += 1
    return -1


def handler(event, context):
    """
    This function gets an instance
    """
    try:
        shuffledListId = json.loads(event['body'])['listID']
        adminId = json.loads(event['body'])['adminID']
    except:
        return {
            "statusCode": 422,
            "headers": {
                "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
            },
            "body": "Missing parameter",
        }
    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute("select listID, multiplicity from public.instances i inner join public.lists l on i.adminID=l.adminID where i.adminId=%s",
                    (adminId))
        multiplicities = {tup[0]: tup[1] for tup in cur.fetchall()}
        lists = {}
        for listId in multiplicities.keys():
            cur.execute("select listItemID from public.lists l inner join public.listItems li on li.listID=l.listID where li.listID=%s", 
                        (listId))
            lists[listId] = {tup[0]: {} for tup in cur.fetchall()}

        for listItemId, listItem in lists[shuffledListId].items():
            cur.execute("select listItemID2, probability from public.probabilities where listItemID1=%s", 
                        (listItemId))
            customProbs = {tup[0]: tup[1] for tup in cur.fetchall()}
            for listId in lists.keys():
                lists[shuffledListId][listItemId][listId] = []
                for i in range(multiplicities[listId] if listId != shuffledListId else multiplicities[listId] - 1):
                    probs = {
                        otherListItem: customProbs[otherListItem] * random.random(
                        ) if otherListItem in customProbs else random.random(
                        ) for otherListItem in lists[listId] if otherListItem not in customProbs or customProbs[otherListItem] > 0}
                    lists[shuffledListId][listItemId][listId].append({'probs': sorted(probs.keys(
                    ), reverse=True, key=lambda x: probs[x])})

        for listId in lists.keys():
            for i in range(multiplicities[listId] if listId != shuffledListId else multiplicities[listId] - 1):
                pairUp(lists, shuffledListId, listId, i, 0, [])

        values = ''
        for listItemId, listItem in lists[shuffledListId].items():
            for i, (listId, mListItem) in enumerate(listItem.items()):
                for probs in mListItem:
                    values += " ('%s','%s','%i')," % (listItemId, probs['pair'], i)
        cur.execute("insert into pairs (fromListItemID,toListItemID,multiplicity) values%s", (values[:-1]))
        conn.commit()

    return {
        "statusCode": 200 if lists != None else 404,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        },
        "body": json.dumps({'lists': lists[shuffledListId]}),
    }
