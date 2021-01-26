import {
  direntFilenameMatchText,
  direntIsFile,
  readJSONFileSync,
  readFixtureFileSync,
  readFixturePathSync,
  readFixtureSync,
  findFilePathByDirnameAndBasename,
  scanFixturePath,
} from './files';

const mock = require('mock-fs');

import { Dirent } from 'fs';
import { Buffer } from 'buffer';

describe('source/files.ts', () => {
  describe('direntIsFile', () => {
    it('returns true for a dirent that is a file', () => {
      const dirent = new Dirent();

      dirent.isFile = jest.fn(() => true);

      expect(direntIsFile(dirent)).toBe(true);
      expect(dirent.isFile).toBeCalled();
    });

    it('returns false for a dirent that is a file', () => {
      const dirent = new Dirent();

      dirent.isFile = jest.fn(() => false);

      expect(direntIsFile(dirent)).toBe(false);
      expect(dirent.isFile).toBeCalled();
    });
  });

  describe('direntFilenameMatchText', () => {
    it('returns true for a dirent that includes the text', () => {
      const dirent = new Dirent();

      dirent.name = 'dirent';

      expect(direntFilenameMatchText('dirent', dirent)).toEqual(true);
    });

    it('returns false for a dirent that does not include the text', () => {
      const dirent = new Dirent();

      dirent.name = 'dirent';

      expect(direntFilenameMatchText('dorent', dirent)).toEqual(false);
    });
  });

  describe('readJSONFileSync', () => {
    it('returns JSON content if file exists', () => {
      const data = readJSONFileSync('./__fixtures__/success.json');

      expect(data).toEqual({
        success: true,
      });
    });
  });

  describe('readFixtureFileSync', () => {
    it('returns JSON content if extension is JSON', () => {
      const data = readFixtureFileSync('./__fixtures__/success.json');

      expect(data).toEqual({
        success: true,
      });
    });

    it('returns raw file if extension is not JSON', () => {
      const data = readFixtureFileSync('./__fixtures__/success.txt');

      expect(data).toBeInstanceOf(Buffer);
    });
  });

  describe('findFilePathByDirnameAndBasename', () => {
    const permissions = ['write', 'read'];

    beforeEach(() => {
      mock({
        'data/users/123': {
          'permissions.json': JSON.stringify(permissions),
        },
      });
    });

    it('returns the fixture file', () => {
      const path = findFilePathByDirnameAndBasename(
        'data/users/123',
        'permissions'
      );

      expect(path).toEqual('data/users/123/permissions.json');
    });

    afterEach(() => {
      mock.restore();
    });
  });

  describe('scanFixturePath', () => {
    const permissions = ['write', 'read'];
    const readOnlyPermissions = ['read'];

    describe('when the path is a folder and has an index file', () => {
      beforeEach(() => {
        mock({
          'data/users/123/permissions': {
            'index.json': JSON.stringify(permissions),
            'index--read-only.json': JSON.stringify(readOnlyPermissions),
          },
        });
      });

      it('returns the fixture file', () => {
        const path = scanFixturePath('users/123/permissions');

        expect(path).toEqual('data/users/123/permissions/index.json');
      });

      it('returns the scenario fixture file', () => {
        const path = scanFixturePath('users/123/permissions', 'read-only');

        expect(path).toEqual(
          'data/users/123/permissions/index--read-only.json'
        );
      });

      afterEach(() => {
        mock.restore();
      });
    });

    describe('when the path is a file', () => {
      beforeEach(() => {
        mock({
          'data/users/123': {
            'permissions.json': JSON.stringify(permissions),
            'permissions--read-only.json': JSON.stringify(readOnlyPermissions),
          },
        });
      });

      it('returns the fixture file', () => {
        const path = scanFixturePath('users/123/permissions');

        expect(path).toEqual('data/users/123/permissions.json');
      });

      it('returns the scenario fixture file', () => {
        const path = scanFixturePath('users/123/permissions', 'read-only');

        expect(path).toEqual('data/users/123/permissions--read-only.json');
      });

      afterEach(() => {
        mock.restore();
      });
    });
  });

  describe('readFixturePathSync', () => {
    const permissions = ['write', 'read'];

    beforeEach(() => {
      mock({
        'data/users/123': {
          'permissions.json': JSON.stringify(permissions),
        },
      });
    });

    it('returns content if file is present', () => {
      const data = readFixturePathSync('users/123/permissions');

      expect(data).toEqual(permissions);
    });

    afterEach(() => {
      mock.restore();
    });
  });

  describe('readFixtureSync', () => {
    const customUserPermissions = ['write', 'read'];
    const genericPermissions = ['read'];

    beforeEach(() => {
      mock({
        'data/users/123': {
          'permissions.json': JSON.stringify(customUserPermissions),
        },
        'data/users/:id': {
          'permissions.json': JSON.stringify(genericPermissions),
        },
      });
    });

    it('loads data fixture if path is not a file', () => {
      const data = readFixtureSync('users/123/permissions');

      expect(data).toEqual(customUserPermissions);
    });

    it('loads file directly if path is a file', () => {
      const data = readFixtureSync('data/users/123/permissions.json');

      expect(data).toEqual(customUserPermissions);
    });

    it("loads fallback file if path doesn't match a file", () => {
      const data = readFixtureSync(
        'users/125/permissions',
        'users/:id/permissions'
      );

      expect(data).toEqual(genericPermissions);
    });

    afterEach(() => {
      mock.restore();
    });
  });
});
