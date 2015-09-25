+++
date = "2015-09-23T07:46:29+08:00"
draft = true
title = "Record Relations"

+++

Ourd supports many-to-one (aka. parent-child) relation between records via _reference_.
`ODReference` is a pointer to a record in database. Let's say we are going to
reference _Record A_ in _Record B_, we first construct a reference of Record A
using its id.

```obj-c
// aID is a placeholder of Record A's id
ODReference *aRef = [ODReference referenceWithRecordID:aID];
```

Then assign this reference as a regular field of Record B:

```obj-c
// bRecord is a placeholder of Record B's object
bRecord[@"parent"] = aRef;
```

It will establish a reference from _Record B_ to _Record A_.

## Eager Loading

Ourd support eager loading of referenced records when you are querying the
referencing records. It's done by supplying a key path expression to
`ODQuery-transientIncludes`:

```obj-c
ODQuery *query = [ODQuery queryWithRecordType:@"child" predicate:nil];
NSExpression *keyPath = [NSExpression expressionForKeyPath:@"parent"];
query.transientIncludes = @{@"parentRecord": keyPath};

[privateDB performQuery:query completionHandler:^(NSArray *results, NSError *error) {
    if (error) {
        NSLog(@"error fetching child: %@", error);
        return;
    }

    NSLog(@"received %@ children", @(results.count));
    for (ODRecord *child in results) {
        ODRecord *parent = child.transient[@"parentRecord"];
        NSLog(@"%@'s parent is %@", child.recordID, parent.recordID);
    }
}];
```

## Reference Actions (not implemented)

`ON DELETE CASCADE` TBC.