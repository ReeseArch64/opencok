export abstract class Hero {
  public abstract readonly name: string;
  public abstract readonly recruitment: {
    readonly fragmentsRequired: number;
  };
  public abstract readonly progression: {
    readonly initialLevel: number;
    readonly maximumLevel: number;
    readonly talentPointDivisor: number;
  };

  public validate(): void {
    const { initialLevel, maximumLevel, talentPointDivisor } = this.progression;
    const values = [
      initialLevel,
      maximumLevel,
      talentPointDivisor,
      this.recruitment.fragmentsRequired,
    ];

    if (values.some((value) => !Number.isSafeInteger(value) || value < 1)) {
      throw new Error(`Invalid hero definition: ${this.name}`);
    }

    if (initialLevel > maximumLevel) {
      throw new Error(`Initial level exceeds maximum: ${this.name}`);
    }
  }
}
