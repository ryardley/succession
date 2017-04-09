import { flatten } from 'ramda';

const tag = (sortTag, item) => Object.assign(item, { sortTag });
const hasTag = sortTag => item => item.sortTag === sortTag;

function orderList(list) {
  const flatList = flatten(list.map(i => (i.list ? i.list : i)));
  const firsts = flatList.filter(hasTag('first'));
  const lasts = flatList.filter(hasTag('last'));
  const rest = flatList.filter(hasTag());
  return [...firsts, ...rest, ...lasts];
}

function chainFunctions(list) {
  const orderedList = orderList(list);
  return (...args) => {
    if (orderedList.length === 0) {
      return args[0];
    }
    const next = orderedList[0];
    const rest = orderedList.slice(1);
    const nextVal = next(...args);
    return chainFunctions(rest)(nextVal);
  };
}

export default function chain(...list) {
  const first = handler => chain(...list, tag('first', handler));
  const last = handler => chain(...list, tag('last', handler));
  return Object.assign(chainFunctions(list), { list, last, first });
}
