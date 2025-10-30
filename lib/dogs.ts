export type Dog = {
  id: string;
  name: string;
  breed: string;
  age: string; // e.g., "2 years", "8 months"
  sex: "Male" | "Female";
  size: "Small" | "Medium" | "Large";
  location: string;
  description: string;
  image: string;
  gallery?: string[];
};

// Dummy dataset — replace with real content later
export const dogs: Dog[] = [
  {
    id: "luna",
    name: "Luna",
    breed: "Labrador Mix",
    age: "2 years",
    sex: "Female",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Playful, people-loving lab mix who adores belly rubs and squeaky toys. Great with kids and other dogs.",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "max",
    name: "Max",
    breed: "German Shepherd",
    age: "3 years",
    sex: "Male",
    size: "Large",
    location: "Sunrise Sanctuary, PR",
    description:
      "Gentle guardian with a big heart. Loves hikes and learning new tricks. House-trained.",
    image:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "bella",
    name: "Bella",
    breed: "Beagle",
    age: "1 year",
    sex: "Female",
    size: "Small",
    location: "Sunrise Sanctuary, PR",
    description:
      "Curious nose, happy tail. Perfect apartment buddy with a surprising zoomie burst.",
    image:
      "https://images.unsplash.com/photo-1546293531-0ff35d0b6d72?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "rocky",
    name: "Rocky",
    breed: "Husky",
    age: "2 years",
    sex: "Male",
    size: "Large",
    location: "Sunrise Sanctuary, PR",
    description:
      "Talkative, handsome, and adventure-ready. Loves cool mornings and long jogs.",
    image:
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "daisy",
    name: "Daisy",
    breed: "Golden Retriever",
    age: "5 years",
    sex: "Female",
    size: "Large",
    location: "Sunrise Sanctuary, PR",
    description:
      "Therapy-dog energy. Calm, affectionate, and always ready for a cuddle.",
    image:
      "https://images.unsplash.com/photo-1558944351-cd981bf76e79?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "charlie",
    name: "Charlie",
    breed: "Border Collie",
    age: "10 months",
    sex: "Male",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Smart as a whip, eager to please, and frisbee-obsessed.",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "coco",
    name: "Coco",
    breed: "Chihuahua Mix",
    age: "4 years",
    sex: "Female",
    size: "Small",
    location: "Sunrise Sanctuary, PR",
    description: "Pocket-sized cutie with a giant personality.",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "buddy",
    name: "Buddy",
    breed: "Pit Bull Mix",
    age: "2 years",
    sex: "Male",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description: "Wiggly, people-first sweetheart. Treat-motivated.",
    image: "https://images.unsplash.com/photo-1518020260433-931778eb4f19?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "molly",
    name: "Molly",
    breed: "Australian Shepherd",
    age: "1.5 years",
    sex: "Female",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description: "Blue-merle beauty with boundless energy.",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "cooper",
    name: "Cooper",
    breed: "Boxer",
    age: "6 years",
    sex: "Male",
    size: "Large",
    location: "Sunrise Sanctuary, PR",
    description: "Goofy gentleman who thinks he’s a lap dog.",
    image: "https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "rosie",
    name: "Rosie",
    breed: "Cocker Spaniel",
    age: "8 months",
    sex: "Female",
    size: "Small",
    location: "Sunrise Sanctuary, PR",
    description: "Silky ears, sweeter heart. Loves gentle walks.",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "bailey",
    name: "Bailey",
    breed: "Shiba Inu",
    age: "3 years",
    sex: "Male",
    size: "Small",
    location: "Sunrise Sanctuary, PR",
    description: "Independent thinker, expert side-eye, loyal friend.",
    image: "https://images.unsplash.com/photo-1518887577432-aedc9f0f7f86?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "sadie",
    name: "Sadie",
    breed: "Poodle Mix",
    age: "4 years",
    sex: "Female",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description: "Low-shed fluffball, perfect for snuggles.",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "zeus",
    name: "Zeus",
    breed: "Great Dane",
    age: "2 years",
    sex: "Male",
    size: "Large",
    location: "Sunrise Sanctuary, PR",
    description: "Gentle giant, couch-approved leaner.",
    image: "https://images.unsplash.com/photo-1558716802-5b6a4bdb5583?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "zoe",
    name: "Zoe",
    breed: "Terrier Mix",
    age: "9 months",
    sex: "Female",
    size: "Small",
    location: "Sunrise Sanctuary, PR",
    description: "Scruffy and spunky with a wag that never quits.",
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "milo",
    name: "Milo",
    breed: "Dachshund",
    age: "7 years",
    sex: "Male",
    size: "Small",
    location: "Sunrise Sanctuary, PR",
    description: "Low rider with high spirits. Nap enthusiast.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "penny",
    name: "Penny",
    breed: "Corgi",
    age: "1.2 years",
    sex: "Female",
    size: "Small",
    location: "Sunrise Sanctuary, PR",
    description: "Short legs, long smiles. Herds hearts for a living.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "leo",
    name: "Leo",
    breed: "Mutt (Best Mix)",
    age: "2.5 years",
    sex: "Male",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description: "Go-with-the-flow pal. Loves car rides and puppuccinos.",
    image: "https://images.unsplash.com/photo-1557977275-0b88b3b0e9f0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "nala",
    name: "Nala",
    breed: "Samoyed",
    age: "2 years",
    sex: "Female",
    size: "Large",
    location: "Sunrise Sanctuary, PR",
    description: "Cloud-like fluff, sunshine smile.",
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "archie",
    name: "Archie",
    breed: "French Bulldog",
    age: "5 years",
    sex: "Male",
    size: "Small",
    location: "Sunrise Sanctuary, PR",
    description: "Snorty comedian, couch snuggler, snack connoisseur.",
    image: "https://images.unsplash.com/photo-1513639725746-c5d3e861f32a?q=80&w=1200&auto=format&fit=crop",
  },
];

export function getDogs(): Dog[] {
  return dogs;
}

export function getDog(id: string): Dog | undefined {
  return dogs.find((d) => d.id === id);
}
