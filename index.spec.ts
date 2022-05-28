import { Rotatelib } from './index';
describe('Rotatelib', () => {
  test('lists items that match criteria', () => {
    const r = new Rotatelib();
    const result = r.list({ hasDate: true, items: ['test2022-05-28', 'test'] });
    expect(result).toHaveLength(1);
  });

  test('list items in the filesystem', () => {
    const r = new Rotatelib();
    // const result = r.list({ hasDate: true, items: ['test2022-05-28', 'test'] });
    // expect(result).toHaveLength(1);
  });
});
