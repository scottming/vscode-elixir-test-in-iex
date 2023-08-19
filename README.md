# elixir-test-in-iex README

Tested in IEx Shell, it's really fast, most tests will run at least _10-20_ times faster, this plugin makes TDD painless.

<img width="741" alt="image" src="https://user-images.githubusercontent.com/12830256/203200498-e01683bd-3951-41b2-bd90-1ebbc0e44ed7.png">

## Installation

You can install it through the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ScottMing.elixir-test-in-iex).

## Features

### TestInIEx: Run test File

It will automatically start the IEx shell and run test in it, for umbrella apps, it will `cd` to the child app of the test file, restart the IEx shell if needed, and run test.

![Nov-27-2022 15-20-02](https://user-images.githubusercontent.com/12830256/204124015-8ff0f905-36d0-4d00-b4c2-083b096a8906.gif)

### TestInIEx: Run Test at Cursor

Similar behavior as `Run test File`, but at the cursor.

![Nov-27-2022 15-21-45](https://user-images.githubusercontent.com/12830256/204124016-b48dab94-1a89-4863-b296-a7686cbc8d8c.gif)


## Hidden features

### TestInIEx: Start Test 

This `elixir-test-in-iex.startIExTest` will start the IEx shell for testing manually. Sometimes, you cancel the IEx shell, and want to do the test again, but it can't be started, because the cache is corrupted, this time, you need this.

### Run the last command

This is not a command, every time you run the test, the plugin will cache the command text, and when you back to product code(not test file), whether you `runTestFile` or `runTestFileAtCursor`, it will automatically execute the previous command.

## Keybindings

By default, the plugin does not bind you any shortcuts, so you need to open the command panel to execute them, or bind your own shortcuts for these two commands: `elixir-test-in-iex.runTestFile` and `elixir-test-in-iex.runTestAtCursor`.

For example:

```json
  {
    "key": "shift+cmd+i f",
    "command": "elixir-test-in-iex.runTestFile",
    "when": "editorTextFocus && editorLangId == 'elixir'"
  },
  {
    "key": "shift+cmd+i c",
    "command": "elixir-test-in-iex.runTestAtCursor",
    "when": "editorTextFocus && editorLangId == 'elixir'"
  }
```

I am a vim user and my recommendation is to use [whichkey](https://github.com/VSpaceCode/vscode-which-key), here is a reference:


```json
    {
      "key": "t",
      "name": "+Test",
      "icon": "test",
      "type": "bindings",
      "bindings": [
        {
          "key": "t",
          "name": "Test at cursor",
          "type": "conditional",
          "bindings": [
            {
              "key": "languageId:elixir",
              "name": "Run elixir test at cursor in IEx shell",
              "type": "command",
              "command": "elixir-test-in-iex.runTestAtCursor"
            },
          ]
        },
        {
          "key": "T",
          "name": "Test File",
          "type": "conditional",
          "bindings": [
            {
              "key": "languageId:elixir",
              "name": "Run elixir test",
              "type": "command",
              "command": "elixir-test-in-iex.runTestFile"
            },
          ]
        },
        {
          "key": "D",
          "name": "Detach the activate terminal",
          "type": "command",
          "command": "workbench.action.terminal.detachSession"
        }
      ]
    }
```

by this keybinding, I only need to press `space t t` or `space t T` to triger the test.

## Q & A

**1. Q: What if run test does not start IEx?**

**A**: The most likely reason is that it has been started before and cached, so the easiest way to fix this is **Detaching** current terminal session, you can set a keybinding for this command: `workbench.action.terminal.detachSession`, after detaching, you can run test again.

**Enjoy!**

This extension is inspired by [neotest](https://github.com/nvim-neotest/neotest) and [vscode-elixir-test](https://github.com/samuelpordeus/vscode-elixir-test]), big thanks to them.
