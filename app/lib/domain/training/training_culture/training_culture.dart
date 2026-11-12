enum TrainingCulture {
  simple(''),
  viking('viking_'),
  japanese('japanese_'),
  chinese('chinese_'),
  persian('persian_'),
  elite('special_');

  const TrainingCulture(this.assetPrefix);
  final String assetPrefix;
  bool get special => this != simple;
}
