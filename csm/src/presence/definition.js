
class Definition {
  constructor(definition) {
    this.definition = definition;
  }

  base(base) {
    this.definition.base = base;

    return this;
  }

  index(index) {
    this.definition.index = index;

    return this; 
  }

  normal(value) {
    this.definition.index.normal.push(value);

    return this;
  }

  gap(value) {
    this.definition.index.gap.push(value);

    return this;
  }

  match(numbers) {
    for (let i = 0; i < numbers.length - this.definition.base + 1; i++) {
      let matched = this.normalMatch(this.definition.index.normal, numbers, i) && this.jumpMatch(this.definition.index.normal, numbers, i);

      if (matched) {
        return true;
      }
    }

    return false;
  }

  normalMatch(normal, numbers, i) {
    return normal.every(pattern => {
      if (Array.isArray(pattern)) {
        return numbers.slice(i + pattern[0], i + pattern[1] + 1).every(presence => presence);
      } else {
        return numbers[i + pattern];
      }
    });
  }

  jumpMatch(normal, numbers, i) {
    return true;
  }
}

export default Definition;