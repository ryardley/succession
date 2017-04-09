import test from 'tape';
import chain from './index';

test('test chain', (t) => {
  t.plan(1);
  const theChain = chain(
    a => a * 2,
    a => a + 2,
  )
  .first(a => a - 4)
  .last(a => `${a} things`);

  t.equal(theChain(10), '14 things', 'Runs functions in the correct order.');
});

test('test nested chain', (t) => {
  t.plan(1);
  const theChain = chain(
    a => a * 2,
    chain(a => a + 2).first(a => a - 4),
  )
  .last(a => `${a} things`);

  t.equal(theChain(10), '14 things', 'Runs functions in the correct order with nested chains.');
});
