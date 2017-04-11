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
  t.plan(1);
  const callOrder = [];
  const chainInstance = chain(
    () => callOrder.push(1),
    () => callOrder.push(2),
  )
  .addLink(() => callOrder.push(0), 1)
  .addLink(() => callOrder.push(3), -1);

  chainInstance();

  t.deepEqual(callOrder, [0,1,2,3]);
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
