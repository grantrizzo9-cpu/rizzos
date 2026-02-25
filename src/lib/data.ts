
export type Theme = {
  name: string;
  colors: {
    [key: string]: string;
  };
};

export const themes: Theme[] = [
  {
    name: 'Sunny Citrus',
    colors: {
      '--background': '0 0% 100%',
      '--foreground': '240 10% 3.9%',
      '--primary': '48 96% 57%',
      '--primary-foreground': '240 10% 3.9%',
      '--card': '50 100% 97%',
      '--card-foreground': '240 10% 3.9%',
      '--accent': '25 95% 53%',
      '--border': '240 5.9% 90%',
    },
  },
  {
    name: 'Oceanic Teal',
    colors: {
      '--background': '0 0% 100%',
      '--foreground': '222.2 84% 4.9%',
      '--primary': '217.2 91.2% 59.8%',
      '--primary-foreground': '210 40% 98%',
      '--card': '190 50% 97%',
      '--card-foreground': '222.2 84% 4.9%',
      '--accent': '160 70% 45%',
      '--border': '214.3 31.8% 91.4%',
    },
  },
  {
    name: 'Fiesta Red',
    colors: {
      '--background': '0 0% 100%',
      '--foreground': '0 0% 15%',
      '--primary': '0 84.2% 60.2%',
      '--primary-foreground': '210 40% 98%',
      '--card': '0 100% 97%',
      '--card-foreground': '0 0% 15%',
      '--accent': '45 95% 55%',
      '--border': '0 10% 90%',
    },
  },
  {
    name: 'Purple Power',
    colors: {
      '--background': '0 0% 100%',
      '--foreground': '260 50% 15%',
      '--primary': '262 84% 60%',
      '--primary-foreground': '0 0% 100%',
      '--card': '260 80% 97%',
      '--card-foreground': '260 50% 15%',
      '--accent': '217.2 91.2% 59.8%',
      '--border': '260 50% 90%',
    },
  },
    {
    name: 'Spring Green',
    colors: {
      '--background': '0 0% 100%',
      '--foreground': '140 40% 15%',
      '--primary': '130 60% 50%',
      '--primary-foreground': '0 0% 100%',
      '--card': '120 70% 97%',
      '--card-foreground': '140 40% 15%',
      '--accent': '48 96% 57%',
      '--border': '120 70% 90%',
    },
  },
  {
    name: 'Coral Reef',
    colors: {
      '--background': '0 0% 100%',
      '--foreground': '240 10% 3.9%',
      '--primary': '5 80% 65%',
      '--primary-foreground': '0 0% 100%',
      '--card': '190 50% 97%',
      '--card-foreground': '240 10% 3.9%',
      '--accent': '210 70% 45%',
      '--border': '190 50% 90%',
    },
  },
  {
    name: 'Midnight Glow',
    colors: {
      '--background': '224 71% 4%',
      '--foreground': '210 20% 98%',
      '--primary': '204 100% 50%',
      '--primary-foreground': '224 71% 4%',
      '--card': '224 71% 9%',
      '--card-foreground': '210 20% 98%',
      '--accent': '204 100% 50%',
      '--border': '215 28% 17%',
    },
  },
];
