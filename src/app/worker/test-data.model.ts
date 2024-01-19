const TEST_DATA_FLOAT_PRECISION = 18;
const COLORS = [
  'red',
  'blue',
  '#f0ca0c',
  '#32f00c',
  'rgb(194, 12, 240)',
  'rgb(240, 156, 12)',
];

export class TestData {
  public id!: string;

  public int!: number;

  public float!: string;

  public color!: string;

  public child!: TestDataChild;

  constructor(testData?: TestData) {
    if (testData) {
      this.id = testData.id;
      this.int = testData.int;
      this.float = testData.float;
      this.color = testData.color;
      this.child = new TestDataChild(testData.child);
    } else {
      this.id = getRandomId();
      this.int = getRandomInt();
      this.float = getRandomFloat();
      this.color = getRandomColor();
      this.child = new TestDataChild();
    }
  }
}

export class TestDataChild {
  public id!: string;

  public color!: string;

  constructor(testDataChild?: TestDataChild) {
    if (testDataChild) {
      this.id = testDataChild.id;
      this.color = testDataChild.color;
    } else {
      this.id = getRandomId();
      this.color = getRandomColor();
    }
  }
}

function getRandomId() {
  return getRandomNumber(1000).toPrecision(3);
}

function getRandomInt() {
  return Math.floor(getRandomNumber(100000));
}

function getRandomFloat() {
  return getRandomNumber(100).toPrecision(TEST_DATA_FLOAT_PRECISION);
}

function getRandomNumber(max: number) {
  return Math.random() * max;
}

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
}
