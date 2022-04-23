import random


def pair_up(lists, listId1, listId2, multiplicity, i, used, unique):
    """Tries to pair up every listitem, if it fails
    it goes back until it finds everyone a pair, unless impossible,
    then it doesn't pair up anything

    Parameters:
    lists (object): this is an object of the lists, lists being represented 
        as objects of listitems and those of probabilities
    listId1 (string): Paired up list id
    listId2 (string): The list being paired with
    multiplicity (int): how many pairs does one have of its own list
    i (int): how far is the recursive program
    used (array of listitem id strings): the items that have been paired up with
    unique (bool): if each listitem pairs up with another listitem exclusively

    Returns:
    0 if it went nicely, -1 if it failed

   """
    if i >= len(lists[listId1]):
        return 0
    listItemId, probs = list(
        enumerate(lists[listId1].items()))[i][1]
    probs = probs[listId2][multiplicity]['probs']
    j = 0
    while True:
        if not j < len(probs):
            break
        if unique and probs[j] in used:
            j += 1
            continue
        lists[listId1][listItemId][listId2][multiplicity]['pair'] = probs[j]
        used.append(probs[j])
        ret = pair_up(lists, listId1, listId2, multiplicity, i+1, used, unique)
        if ret == 0:
            return 0
        del lists[listId1][listItemId][listId2][multiplicity]['pair']
        used.remove(probs[j])
        j += 1
    return -1


def shuffle(adminId, conn):
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
        cur.execute(
            "select shuffled, shuffledID, uniqueInMul from public.instances where adminId=%s", (adminId))
        [shuffled, shuffledListId, unique] = cur.fetchone()
        if (shuffled): raise Exception("Already shuffled")

        # get lists 
        cur.execute("select listID, multiplicity from public.instances i inner join public.lists l on i.adminID=l.adminID where i.adminId=%s",
                    (adminId))
        multiplicities = {tup[0]: tup[1] for tup in cur.fetchall()}
        lists = {}

        # get list items
        for listId in multiplicities.keys():
            cur.execute("select listItemID from public.lists l inner join public.listItems li on li.listID=l.listID where li.listID=%s", 
                        (listId))
            lists[listId] = {tup[0]: {} for tup in cur.fetchall()}

        # get probabilities 
        if shuffledListId not in lists: raise Exception("Wrong shuffled list id")
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

        # pair up shuffled list with others
        for listId in lists.keys():
            for i in range(multiplicities[listId] if listId != shuffledListId else multiplicities[listId] - 1):
                pair_up(lists, shuffledListId, listId, i, 0, [], unique)

        # save results
        values = ''
        for listItemId, listItem in lists[shuffledListId].items():
            for i, (listId, mListItem) in enumerate(listItem.items()):
                for probs in mListItem:
                    if 'pair' in probs:
                        values += " ('%s','%s','%i','%s')," % (listItemId, probs['pair'], i, listId)
        if (len(values) > 0): 
            cur.execute("insert into pairs (listItemID1,listItemID2,multiplicity,listID2) values"+ values[:-1])
            cur.execute("update instances set shuffled=true where adminID=%s", (
                adminId))
            conn.commit()
        conn.commit()

    return lists