import * as Validation from '../helpers/validations';
import { populateStartText } from '../helpers/validations';

const EXTENSION_PATH = '/home/username/.vscode/extensions/vscode-elixir-test-in-iex/';

describe(`populateStartText/3`, () => {
  test('it should not return the default start text when not in a umbrella app', () => {
    const openedFileName = '/demo/file_test.exs';
    const cwdFun = () => '/demo';

    const result = populateStartText(openedFileName, EXTENSION_PATH, cwdFun);
    expect(result).toMatch(/^MIX_ENV=test/i);
  });

  test('it should return the default start text when not in a file', () => {
    const openedFileName = undefined;
    const cwdFun = () => '/demo';

    const result = populateStartText(openedFileName, EXTENSION_PATH, cwdFun);
    expect(result).toMatch(/^MIX_ENV=test/i);
  });

  test('it should return text that `cd` to child app dir when in a umbrella app', () => {
    const childAppPath = '/umbrella_demo/apps/child_app';
    const openedFileName = childAppPath + '/file_test.exs';
    const cwdFun = () => '/umbrella_demo';

    const result = populateStartText(openedFileName, EXTENSION_PATH, cwdFun);
    expect(result).toMatch(`cd ${childAppPath}`);
  });
});

describe(`populateStartText/3 for Elixir 1.15`, () => {
  test('returns false when Elixir version is bigger than 1.15', () => {
    const mockAsdfElixirVersion = jest.spyOn(Validation, 'asdfElixirVersion');
    let result = 'elixir          1.15.4-otp-25   /Users/scottming/Code/.tool-versions';
    mockAsdfElixirVersion.mockReturnValue(result);
    expect(Validation.smallerThan115('/demo')).toBe(false);
  });
  test('returns true when Elixir version is smaller than 1.15', () => {
    const mockAsdfElixirVersion = jest.spyOn(Validation, 'asdfElixirVersion');
    let result = 'elixir          1.14.4-otp-25   /Users/scottming/Code/.tool-versions';
    mockAsdfElixirVersion.mockReturnValue(result);
    expect(Validation.smallerThan115('/demo')).toBe(true);
  });

  test('returns false when Elixir version is not found', () => {
    const mockAsdfElixirVersion = jest.spyOn(Validation, 'asdfElixirVersion');
    let result =
      'elixir          ______          No version is set. Run "asdf <global|shell|local> elixir <version>"';
    mockAsdfElixirVersion.mockReturnValue(result);
    expect(Validation.smallerThan115('/demo')).toBe(false);
  });

  test('returns false when asdf command is not found', () => {
    const mockAsdfElixirVersion = jest.spyOn(Validation, 'asdfElixirVersion');
    let result = null;
    mockAsdfElixirVersion.mockReturnValue(result);
    expect(Validation.smallerThan115('/demo')).toBe(false);
  });
});
