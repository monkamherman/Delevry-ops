import {
  compact,
  uniqBy,
  groupBy,
  sortBy,
  getNestedValue,
  keyBy,
  chunk,
  mergeUnique,
  difference,
  intersection,
  deepClone,
  deepMerge,
  cleanObject,
  isEmptyObject,
  getValue,
  setValue,
  pick,
  omit,
  transformKeys,
  transformValues
} from '../collection';

describe('Array Utilities', () => {
  describe('compact', () => {
    it('supprime les valeurs null et undefined', () => {
      const arr = [1, null, 2, undefined, 3, 0, false, ''];
      expect(compact(arr)).toEqual([1, 2, 3, 0, false, '']);
    });
  });

  describe('uniqBy', () => {
    it('supprime les doublons basés sur une propriété', () => {
      const arr = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 1, name: 'C' }
      ];
      expect(uniqBy(arr, 'id')).toHaveLength(2);
    });

    it('supprime les doublons avec une fonction de sélection', () => {
      const arr = [1.2, 1.9, 2.1, 3.5, 4.0];
      expect(uniqBy(arr, Math.floor)).toEqual([1.2, 2.1, 3.5, 4.0]);
    });
  });

  describe('groupBy', () => {
    it('groupe les éléments par une propriété', () => {
      const arr = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 }
      ];
      const result = groupBy(arr, 'category');
      expect(Object.keys(result)).toEqual(['A', 'B']);
      expect(result.A).toHaveLength(2);
    });
  });

  describe('sortBy', () => {
    it('trie par une propriété', () => {
      const arr = [{ id: 2 }, { id: 3 }, { id: 1 }];
      const result = sortBy(arr, 'id');
      expect(result[0].id).toBe(1);
    });

    it('trie en ordre décroissant', () => {
      const arr = [{ id: 2 }, { id: 3 }, { id: 1 }];
      const result = sortBy(arr, '-id');
      expect(result[0].id).toBe(3);
    });
  });

  describe('getNestedValue', () => {
    const obj = { user: { name: 'John', address: { city: 'Paris' } } };
    
    it('récupère une valeur imbriquée', () => {
      expect(getNestedValue(obj, 'user.name')).toBe('John');
      expect(getNestedValue(obj, 'user.address.city')).toBe('Paris');
    });

    it('retourne undefined pour un chemin inexistant', () => {
      expect(getNestedValue(obj, 'user.age')).toBeUndefined();
    });
  });

  describe('keyBy', () => {
    it('crée un objet indexé par une clé', () => {
      const arr = [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 }
      ];
      const result = keyBy(arr, 'id');
      expect(result.a.value).toBe(1);
      expect(result.b.value).toBe(2);
    });
  });

  describe('chunk', () => {
    it('divise un tableau en morceaux', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(chunk(arr, 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
  });

  describe('mergeUnique', () => {
    it('fusionne des tableaux en supprimant les doublons', () => {
      expect(mergeUnique([1, 2], [2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('difference', () => {
    it('trouve la différence entre deux tableaux', () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
    });
  });

  describe('intersection', () => {
    it('trouve l\'intersection de plusieurs tableaux', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });
  });
});

describe('Object Utilities', () => {
  describe('deepClone', () => {
    it('crée une copie profonde', () => {
      const obj = { a: { b: 1 } };
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
    });
  });

  describe('deepMerge', () => {
    it('fusionne des objets en profondeur', () => {
      const target = { a: { b: 1, c: 2 } };
      const source = { a: { b: 3, d: 4 } };
      const result = deepMerge(target, source);
      expect(result).toMatchObject({ a: { b: 3, c: 2, d: 4 } });
    });
  });

  describe('cleanObject', () => {
    it('supprime les propriétés avec des valeurs null ou undefined', () => {
      const obj = { a: 1, b: null, c: undefined, d: '' };
      expect(cleanObject(obj, { removeEmptyStrings: false })).toEqual({ a: 1, d: '' });
    });

    it('supprime les chaînes vides si removeEmptyStrings est vrai', () => {
      const obj = { a: 1, b: null, c: undefined, d: '' };
      expect(cleanObject(obj)).toEqual({ a: 1 });
    });
  });

  describe('isEmptyObject', () => {
    it('vérifie si un objet est vide', () => {
      expect(isEmptyObject({})).toBe(true);
      expect(isEmptyObject({ a: 1 })).toBe(false);
    });
  });

  describe('getValue/setValue', () => {
    it('récupère et définit des valeurs par chemin', () => {
      const obj = { a: { b: 1 } };
      expect(getValue(obj, 'a.b')).toBe(1);
      
      const updated = setValue(obj, 'a.c', 2);
      expect(getValue(updated, 'a.c')).toBe(2);
    });
  });

  describe('pick/omit', () => {
    const obj = { a: 1, b: 2, c: 3 };
    
    it('sélectionne des propriétés', () => {
      expect(pick(obj, ['a', 'b'])).toEqual({ a: 1, b: 2 });
    });

    it('exclut des propriétés', () => {
      expect(omit(obj, ['a'])).toEqual({ b: 2, c: 3 });
    });
  });

  describe('transformKeys/transformValues', () => {
    const obj = { firstName: 'John', lastName: 'Doe' };
    
    it('transforme les clés', () => {
      const result = transformKeys(obj, (key: string) => key.toUpperCase());
      expect(result).toHaveProperty('FIRSTNAME', 'John');
    });

    it('transforme les valeurs', () => {
      const result = transformValues(obj, (value: string) => value.toUpperCase());
      expect(result).toEqual({ firstName: 'JOHN', lastName: 'DOE' });
    });
  });
});
