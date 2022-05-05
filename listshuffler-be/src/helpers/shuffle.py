import random
import logging

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


class ShuffleError(Exception):
    pass


def pair_up(list_w_sorted, used, pairs, unique=True):
    """Tries to pair up every listitem, if it fails
    it goes back until it finds everyone a pair, unless impossible,
    then it doesn't pair up anything

    Parameters:
    list ([[string, [string]]]): tuples of unpaired listItemIDs like [[listItemID1, sorted [listItemID2]]]
    used ([string]): array of used listItemID2s
    pairs ({string: string}): already paired
    unique (bool): if each listitem pairs up with another listitem exclusively, default True

    Returns:
    pairs ({string: string})

   """
    if not len(list_w_sorted) > 0:
        return pairs
    j = 0
    while j < len(list_w_sorted[0][1]):
        if unique and list_w_sorted[0][1][j] in used:
            j += 1
            continue
        trying_pairs = pairs.copy()
        trying_pairs[list_w_sorted[0][0]] = list_w_sorted[0][1][j]
        trying_used = used.copy()
        trying_used.append(list_w_sorted[0][1][j])
        ret = pair_up(list_w_sorted[1:], trying_used, trying_pairs, unique)
        if ret != None:
            return ret
        j += 1
    return None


def shuffle(admin_id, conn):
    """
    This shuffles the lists
    Parameters:
    adminId (string): admin id
    unique (boolean): can one pair up with an item already paired up in the same list copy
    conn (pymysql connection): pymysql database connection

    Returns:
    lists
    """
    with conn.cursor() as cur:
        cur.execute("""select shuffled, shuffledID, uniqueInMul 
            from public.instances 
            where adminId=%s""", (admin_id))
        [shuffled, shuffled_list_id, unique] = cur.fetchone()
        if (shuffled):
            logger.info("ERROR: Already shuffled")
            raise ShuffleError("Already shuffled")

        # get lists
        cur.execute("""select listID, multiplicity 
            from public.instances i inner join public.lists l on i.adminID=l.adminID 
            where i.adminId=%s""", (admin_id))
        multiplicities = {tup[0]: tup[1] if tup[0] !=
                          shuffled_list_id else tup[1] - 1 for tup in cur.fetchall()}
        if shuffled_list_id not in multiplicities.keys():
            logger.info("ERROR: Wrong shuffled list id")
            raise ShuffleError("Wrong shuffled list id")

        # get list items
        lists = {}
        for list_id in multiplicities.keys():
            cur.execute("""select listItemID 
                from public.lists l inner join public.listItems li on li.listID=l.listID 
                where li.listID=%s""", (list_id))
            lists[list_id] = {tup[0]: {} for tup in cur.fetchall()}

        # get probabilities
        for listitem_id in lists[shuffled_list_id].keys():
            cur.execute("""select listItemID2, probability 
                from public.probabilities 
                where listItemID1=%s""", (listitem_id))
            lists[shuffled_list_id][listitem_id] = {
                tup[0]: tup[1] for tup in cur.fetchall()}

        # set random values
        list_pairables = {}
        for list_id in lists.keys():
            list_pairables[list_id] = []
            for i in range(multiplicities[list_id]):
                sorted_pairables = []
                for list_item_id in random.sample(list(lists[shuffled_list_id].keys()), len(lists[shuffled_list_id])):
                    probabilities = {}
                    for otherListItem in lists[list_id]:
                        if otherListItem in lists[shuffled_list_id][list_item_id]:
                            if lists[shuffled_list_id][list_item_id][otherListItem] > 0:
                                probabilities[otherListItem] = lists[shuffled_list_id][list_item_id][otherListItem] * random.random()
                        else:
                            probabilities[otherListItem] = random.random()
                    sorted_pairables.append([list_item_id, sorted(probabilities.keys(
                    ), reverse=True, key=lambda x: probabilities[x])])
                list_pairables[list_id].append(sorted_pairables)

        # pair up shuffled list with others
        paired = {}
        for list_id in lists.keys():
            paired[list_id] = []
            for i in range(multiplicities[list_id]):
                paired[list_id].append(
                    pair_up(list_pairables[list_id][i], [], {}, unique))

        # save results
        values = ''
        for list_id, paired_list in paired.items():
            for i, dict in enumerate(paired_list):
                if dict == None:
                    logger.info("ERROR: Could not shuffle")
                    raise ShuffleError("Could not shuffle")
                for list_item_id1, list_item_id2 in dict.items():
                    values += " ('%s','%s','%i','%s')," % (list_item_id1,
                                                           list_item_id2, i, list_id)
        if (len(values) > 0):
            cur.execute(
                "insert into pairs (listItemID1,listItemID2,multiplicity,listID2) values" + values[:-1])
            cur.execute("update instances set shuffled=true where adminID=%s", (
                admin_id))
            conn.commit()
            logger.info("SUCCESS: Successfully shuffled")
        else:
            logger.info("ERROR: No pairs")
            raise ShuffleError("Not enough pairs")
