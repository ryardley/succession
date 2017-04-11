import test from 'tape';
import chain from './index';

test('test chain', (t) => {
  t.plan(1);
  const aa = a => a - 4;
  const bb = a => a * 2;
  const cc = a => a + 2;
  const dd = a => `${a} things`;

  // used to log out function execution order
  aa.myName = 'aa';
  bb.myName = 'bb';
  cc.myName = 'cc';
  dd.myName = 'dd';

  const theChain = chain(
    bb,
    cc,
  )
  .first(aa)
  .last(dd);

  t.equal(theChain(10), '14 things', 'Runs functions in the correct order.');
});

test('test ordered chain', (t) => {
  let calls = [];

  chain(
    () => calls.push(1),
    () => calls.push(2),
  )
  .addLink(() => calls.push(0), 1)
  .addLink(() => calls.push(3), -1)();

  t.deepEqual(calls, [0,1,2,3]);
  t.end();
});

test('test ordered chain', (t) => {
  let calls = [];

  chain()
    .addLink(() => calls.push('a'), -1)
    .addLink(() => calls.push('b'))();

  t.deepEqual(calls, ['b','a']);
  t.end();
})

test('test ordered chain', (t) => {
  let calls = [];

  chain()
    .addLink(() => calls.push('f'), -1)
    .addLink(() => calls.push('e'), -2)
    .addLink(() => calls.push('a'), 1)
    .addLink(() => calls.push('b'), 2)
    .addLink(() => calls.push('c'), 2)
    .addLink(() => calls.push('d'))
    ();

  t.deepEqual(calls, ['a', 'b', 'c', 'd', 'e', 'f']);
  t.end();
})

test('test nested chain', (t) => {
  t.plan(1);
  const theChain = chain(
    a => a * 2,
    chain(a => a + 2).first(a => a - 4),
  )
  .last(a => `${a} things`);

  t.equal(theChain(10), '14 things', 'Runs functions in the correct order with nested chains.');
});
