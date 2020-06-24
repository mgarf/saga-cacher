# Saga Cacher

* Extends Saga providing caching functionality to TakeEvery

* TakeEvery takes two new parameters: Cache & CacheTime

## How to use

Rather than importing redux-saga effects:

```javascript
import { put, takeEvery, all, select } from 'redux-saga/effects';
```

Import the middleware instead:

```javascript
import { put, takeEvery, all, select } from '@mgarf/saga-cacher';
```

## List Item Caching

This middlware has the ability to do caching on items in a list. 

In the event pass `key` to denote the unique primary key on the items being cached. Then pass that primary key and it will add it to a list with other records under the same event and each list item will have its only individual cache expiration time.

*Example*

```javascript

{   
    type: "SPECIFIC_ITEM", 
    id: "1", 
    key: "id"
}

```

## Notes

* Cache defaults to false
* Cache Time defaults to 5

## Snippet of the overriding function

```javascript

function* takeEvery(event, worker, cache = false, cacheTime = 5) {

}

```

## Limitations

* This only overrides takeEvery

* This is being used for a side project so please test heavily in any implementation it's used in.
