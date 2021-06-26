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
