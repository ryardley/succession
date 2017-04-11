import { flatten } from 'ramda';

const tag = (sortTag, item) => Object.assign(item, { sortTag });
const getTag = sortTag => item => item.sortTag;
const hasTag = tag => item => item.sortTag === tag;

function nlize(int){
  if(int < 0){
    return Number.MAX_SAFE_INTEGER + int;
  }
  if(int > 0){
    return Number.MIN_SAFE_INTEGER + int;
  }
  return int;
}

const sortByTag = tagFinder => (a, b) => {
  const an = nlize(tagFinder(a));
  const bn = nlize(tagFinder(b));
  if(an > bn){
    return 1;
  }
  if(an === bn){
    return 0;
  }
  if(an < bn){
    return -1;
  }
}

function orderList(list) {
  const flatList = flatten(list.map(i => (i.list ? i.list : i)));
  return flatList.concat().sort(sortByTag(item => item.sortTag || 0))
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
  const first = handler => chain(...list, tag(1, handler));
  const addLink = (handler, order) => chain(...list, tag(order, handler));
  const last = handler => chain(...list, tag(-1, handler));
  return Object.assign(chainFunctions(list), { list, last, first, addLink });
}
