
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
    let matched = false;

    console.log(this.definition.index.normal);

    for (let i = 0; i < numbers.length - this.definition.base + 1; i++) {
      for (pattern of this.definition.index.normal) {
        console.log(pattern);
        if (Array.isArray(pattern)) {
          matched = matched || numbers.slice(pattern[0], pattern[1]).reduce((acculumate, presence) => acculumate && presence);
        } else {
          matched = matched || numbers[pattern];
        }
      }
        // if (numbers.slice(i, i + 4).reduce((matched, presence) => matched && presence)) {
        //     return true;
        // }
    }

    return false;
  }
}

export default Definition;