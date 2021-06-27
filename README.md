# knex-utils

[![npm version](http://img.shields.io/npm/v/knex-utils.svg)](https://npmjs.org/package/knex-utils)
![](https://github.com/knex/knex-utils/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/knex/knex-utils/badge.svg?branch=master)](https://coveralls.io/r/knex/knex-utils?branch=master)

Useful utilities for Knex.js

## Library documentation

### Database heartbeat

* `checkHeartbeat(knex: Knex, heartbeatQuery?: string)` - run a SQL query against DB to check if it is responding. If query is not specified, uses the default one, which should work on majority of RDBMS, other than Oracle. Returned entity structure:
```ts
interface HeartbeatResult {
    isOk: boolean
    error?: Error
}
```  

* `HEARTBEAT_QUERIES` - a map of SQL queries for performing a heartbeat check on various databases.

### DB param object manipulation

* `copyWithoutUndefined(originalValue: T): T` - returns a copy of provided object without properties that have undefined value. This is useful, because while Knex treats `null` as a SQL null value (e. g. "Return all rows where column XYZ is set to NULL"), it considers `undefined` to be an input error. Therefore, it is common to write update operations like this:

```ts
  async function updateUser(knex: Knex, userId: number, userUpdate: UpdateUserRow): Promise<UserRow> {
    const userUpdateParams = copyWithoutUndefined({
      name: userUpdate.name,
      email: userUpdate.email,
    })

    const updatedUserRows = await knex('users')
      .where({ userId })
      .update(updateUserParams)
      .returning(['userId', 'name', 'email']])

    return updatedUserRows[0]
  }
```

* `isEmptyObject(params: Record<string, any>): boolean` - returns true, if object has only undefined properties. This is useful e. g. for optional update params, to determine whether whole operation can be skipped. For a full example see `pick` method.

* `pick(source: T, propNames: K[]): Pick<T, Exclude<keyof T, Exclude<keyof T, K>>>` - returns a new object which includes all the properties, specified in the argument `propNames`. It is helpful for extracting a subset of parameters for passing across the layers, for an example, when a single service call results in two repository calls:

```ts
  async function updateUser(
    userId: number,
    fullUserUpdate: FullUserUpdate,
  ): Promise<UserUpdateDto> {
    const existingUser = await getUser(userId)
    const existingEmployee = await getEmployeeByUserId(userId)
    if (!existingUser) {
        throw new Error('User does not exist')
    }
    if (!existingEmployee) {
        throw new Error('Employee does not exist')
    }
    const userUpdates = pick(fullUserUpdate, [
      'userId',
      'name',
      'email',
    ])
    const employeeUpdate = pick(fullUserUpdate, [
      'userId',
      'employmentNumber',
      'position',
      'worksFrom',
      'worksTo',
    ])
    let updatedUser: UserRow = existingUser
    let updatedEmployee: EmployeeRow = existingEmployee
    if (!isEmptyObject(userUpdates)) {
      updatedUser = await this.userRepository.updateUser(userId, userUpdates)
    }
    if (!isEmptyObject(employeeUpdate)) {
      updatedEmployee = await this.employeeRepository.updateEmployee(userId, employeeUpdate)
    }
    return { ...updatedUser, ...updatedEmployee }
  }
```

### DB relation difference operations

* `calculateEntityListDiff(oldList: T[], newList: T[], idFields: string[]): EntityListDiff<T>` - given the two lists of entities, identity of said entities defined by a given set of properties, calculates two lists of entities: the ones that were removed, and the ones that were added in the new list, as compared to the old list.

* `updateJoinTable(knex: Knex, newList: T[], params: UpdateJoinTableParams): EntityListDiff<T>` - compares a new list of entities to a current state of database, deletes all entries that are no longer in the list.

```ts
interface UpdateJoinTableParams {
    filterCriteria: Record<string, any> // Parameters that will be used for retrieving the old list. Typically you would be using all or some fields from `idFields` param for the filter query, to ensure you are only updating relationships of a specific parent, although it is not impossible to imagine a scenario when you would like to potentially repopulate the whole table, which would require empty filter criteria.
    table: string // DB table that will be used for retrieving existing data, and deleting removed / inserting added data.
    idFields: string[] // Combination of fields that allows to uniquely identify each entity. For a join table that typically would be a combination of all the foreign key columns, but sometimes it may include additional columns as well (e. g. a columnm, specifying relation type between the linked entities). Note that it probably shouldn't be a synthetic, DB sequence-based primary key, because for new entries that were not yet inserted, you are unlikely to have them.    
    primaryKeyField?: string // If table has single primary key that uniquely identifies each row (typically a synthetic, DB sequence-based one), it can be used for batch deletion of removed entries, dramatically improving performance.
    chunkSize?: number // How many rows per statement should be used for batch insert/delete operations. Default is 100
}
```

Note that this is not an upsert operation and should not be used as one. If there is a match based on `idFields` property combination, even if other fields are different, this method will leave the row as-is. As the name of the function suggests, this is primarily useful for the join table situation, when you might want to perform multiple deletion and insertion operations to reach the desired state.

Example:
```ts
  const oldList = generateAssets(0, { orgId: 'kiberion', linkType: 'primaryAsset' }, 10)
  await knex('joinTable').insert(oldList)
  const newList = generateAssets(10000, { orgId: 'kiberion', linkType: 'primaryAsset' }, 4)
  const mixedList = [oldList[0], ...newList]

  // this will result in all the elements from the old list, other than the first one, to be deleted, and all the elements in the new list to be inserted
  await updateJoinTable(knex, mixedList, {
    primaryKeyField: 'id',
    idFields: ['userId', 'orgId', 'linkType'],
    table: 'joinTable',
    filterCriteria: {
      orgId: 'kiberion',
      linkType: 'primaryAsset',
    },
  })
```
