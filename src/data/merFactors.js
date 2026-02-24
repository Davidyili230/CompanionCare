export const MER_FACTORS = {
  dog: {
    adult: {
      neutered: 1.6,
      intact: 1.8,
      inactive_prone_obese: 1.2,
      weight_loss: 1.0,
      hospitalized: 1.0,
    },
    growth: {
      puppy_under_4m: 3.0,
      puppy_over_4m: 2.0,
    },
    reproduction: {
      gestation: 2.0,
      lactation: 3.0,
    }
  },
  cat: {
    adult: {
      neutered: 1.2,
      intact: 1.4,
      inactive_prone_obese: 1.0,
      weight_loss: 0.8,
      hospitalized: 1.0,
    },
    growth: {
      kitten: 2.5,
    },
    reproduction: {
      gestation: 2.5,
      lactation: 4.0,
    }
  }
};