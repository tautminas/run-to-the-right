# Future Improvements of Run to the Right

Possibilities:

- Make game playable without the keyboard for the mobile users of the website.
- Add a button to resize the screen for the optimal height and width of the game.
- Add possibility to change controls.
- Make the appearance of the bombs smoother. Now they can possibly appear directly from the platforms.

Refactor the code 🙂:

- Add a preloading scene.
- Divide PlayScene into different classes. The file is too big for future improvements.
- Move repeating code to different methods (adjustment of parameters in updateDifficulty, hitBomb and hitFlyingEyeMonster with hitSkeleton has repeated code, playing sound functionality is repeated in all of the scenes).
- Remove unused parameters in functions (attackFlyingEyeMonster and attackSkeleton).
- Fix console warn "Missing animation: fall" which is received after the game restart with Enter when player dies.
