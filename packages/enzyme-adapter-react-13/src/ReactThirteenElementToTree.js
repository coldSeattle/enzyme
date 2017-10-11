import flatten from 'lodash/flatten';
import { isIterable } from 'enzyme-adapter-utils';

export function nodeTypeFromType(type) {
  if (typeof type === 'string') {
    return 'host';
  }
  if (
    type &&
    type.prototype &&
    (typeof type.prototype.render === 'function')
  ) {
    return 'class';
  }
  return 'function';
}

export default function elementToTree(el) {
  if (el === null || typeof el !== 'object' || !('type' in el)) {
    return el;
  }
  const { type, props, key, ref } = el;
  const { children } = props;
  let rendered = null;
  if (Array.isArray(children)) {
    rendered = flatten(children, true).map(elementToTree);
  } else if (isIterable(children) && typeof children !== 'string') {
    rendered = flatten([...children], true).map(elementToTree);
  } else if (typeof children !== 'undefined') {
    rendered = elementToTree(children);
  }
  return {
    nodeType: nodeTypeFromType(type),
    type,
    props,
    key,
    ref,
    instance: null,
    rendered,
  };
}
