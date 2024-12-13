# Program Testing Results

## Create Program

| Scenario       | Details                                    | Name | Result |
| -------------- | ------------------------------------------ | ---- | ------ |
| Create Program | Add 1 workout with 1 exercise and 1 set    | CP1  | PASS   |
| Create Program | Add 2 workouts with 3 exercises and 3 sets | CP2  | PASS   |
| Create Program | Add 3 workouts with 3 exercises and 3 sets | CP3  | PASS   |

## Edit Program

| Scenario     | Details                                                                                                | Name     | Result |
| ------------ | ------------------------------------------------------------------------------------------------------ | -------- | ------ |
| Edit Program | Change Program Name, workout Name and some main program properties                                     | EP1      | PASS   |
| Edit Program | Remove a workout, and exercise                                                                         | EP2      | PASS   |
| Edit Program | Add 1 workout (PASSED) and add 1 exercise (FAILED) and 1 set                                           | Cooper W | FAILED |
| Edit Program | Modify workout name (PASSED), remove a workout (PASSED), add workout (PASSED) and add exercise(FAILED) | EP4      | FAILED |

## Program Workout

| Scenario        | Details                                            | Name | Result | Notes                                                                                |
| --------------- | -------------------------------------------------- | ---- | ------ | ------------------------------------------------------------------------------------ |
| Program Workout | Change workout Name and Add sets                   | PW1  | PASS   |                                                                                      |
| Program Workout | Add exercises and sets                             | PW2  | FAILED | When adding an exercise, the new exercise array is duplicating the existing exercise |
| Program Workout | Delete exercise and add sets to remaining exercise | PW3  | FAILED | Not deleting exercise                                                                |

## Flex Workout

| Scenario     | Details                                            | Name | Result | Notes                                                                   |
| ------------ | -------------------------------------------------- | ---- | ------ | ----------------------------------------------------------------------- |
| Flex Workout | Change workout Name and Add sets                   | FW1  | FAILED | Failed to complete workout: [Error: Missing or invalid required fields] |
| Flex Workout | Add exercises and sets                             | FW2  |        |                                                                         |
| Flex Workout | Delete exercise and add sets to remaining exercise | FW3  |        |                                                                         |

## Delete Program

| Scenario       | Details          | Name | Result |
| -------------- | ---------------- | ---- | ------ |
| Delete Program | Delete a program |      | FAILED |
