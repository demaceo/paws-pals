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

// Real dogs from Sunrise Sanctuary, PR
export const dogs: Dog[] = [
  {
    id: "caramelo",
    name: "Caramelo",
    breed: "To be determined",
    age: "To be determined",
    sex: "Male",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Meet Caramelo! More details coming soon. This sweet pup is waiting for their forever home.",
    image: "/dogs/Caramelo /IMG_3146.JPG",
    gallery: [
      "/dogs/Caramelo /IMG_3146.JPG",
      "/dogs/Caramelo /IMG_3142.jpg",
      "/dogs/Caramelo /IMG_3143.jpg",
      "/dogs/Caramelo /IMG_3144.jpg",
      "/dogs/Caramelo /IMG_3145.jpg",
    ],
  },
  {
    id: "chocolate",
    name: "Chocolate",
    breed: "To be determined",
    age: "To be determined",
    sex: "Male",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Meet Chocolate! More details coming soon. This sweet pup is waiting for their forever home.",
    image: "/dogs/Chocolate /IMG_3135.jpg",
    gallery: [
      "/dogs/Chocolate /IMG_3135.jpg",
      "/dogs/Chocolate /IMG_3136.jpg",
      "/dogs/Chocolate /IMG_3137.jpg",
    ],
  },
  {
    id: "fitz",
    name: "Fitz",
    breed: "To be determined",
    age: "To be determined",
    sex: "Male",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Meet Fitz! More details coming soon. This sweet pup is waiting for their forever home.",
    image: "/dogs/Fitz/IMG_3199.jpg",
    gallery: [
      "/dogs/Fitz/IMG_3199.jpg",
      "/dogs/Fitz/IMG_3201.jpg",
      "/dogs/Fitz/IMG_3202.jpg",
      "/dogs/Fitz/IMG_3205.jpg",
      "/dogs/Fitz/IMG_3208.jpg",
      "/dogs/Fitz/IMG_3210.jpg",
      "/dogs/Fitz/IMG_3211.jpg",
      "/dogs/Fitz/IMG_3214.jpg",
      "/dogs/Fitz/IMG_3215.jpg",
      "/dogs/Fitz/IMG_3216.jpg",
      "/dogs/Fitz/IMG_3218.jpg",
    ],
  },
  {
    id: "manchas",
    name: "Manchas",
    breed: "To be determined",
    age: "To be determined",
    sex: "Male",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Meet Manchas! More details coming soon. This sweet pup is waiting for their forever home.",
    image: "/dogs/Manchas/IMG_3148.jpg",
    gallery: [
      "/dogs/Manchas/IMG_3148.jpg",
      "/dogs/Manchas/IMG_3149.jpg",
      "/dogs/Manchas/IMG_3150.jpg",
      "/dogs/Manchas/IMG_3151.jpg",
      "/dogs/Manchas/IMG_3152.jpg",
      "/dogs/Manchas/IMG_3156.jpg",
    ],
  },
  {
    id: "mila",
    name: "Mila",
    breed: "To be determined",
    age: "To be determined",
    sex: "Female",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Meet Mila! More details coming soon. This sweet pup is waiting for their forever home.",
    image: "/dogs/Mila/IMG_3124.jpg",
    gallery: [
      "/dogs/Mila/IMG_3124.jpg",
      "/dogs/Mila/IMG_3125.jpg",
      "/dogs/Mila/IMG_3126.jpg",
      "/dogs/Mila/IMG_3127.jpg",
      "/dogs/Mila/IMG_3128.jpg",
      "/dogs/Mila/IMG_3129.jpg",
    ],
  },
  {
    id: "negro",
    name: "Negro",
    breed: "To be determined",
    age: "To be determined",
    sex: "Male",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Meet Negro! More details coming soon. This sweet pup is waiting for their forever home.",
    image: "/dogs/Negro/IMG_3165.JPG",
    gallery: [
      "/dogs/Negro/IMG_3165.JPG",
      "/dogs/Negro/IMG_3167.JPG",
      "/dogs/Negro/IMG_3169.jpg",
      "/dogs/Negro/IMG_3170.JPG",
      "/dogs/Negro/IMG_3174.jpg",
      "/dogs/Negro/IMG_3175.jpg",
      "/dogs/Negro/IMG_3176.jpg",
      "/dogs/Negro/IMG_3177.jpg",
    ],
  },
  {
    id: "roxanne",
    name: "Roxanne",
    breed: "To be determined",
    age: "To be determined",
    sex: "Female",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Meet Roxanne! More details coming soon. This sweet pup is waiting for their forever home.",
    image: "/dogs/Roxanne/9c1a3eda-11e9-4bb6-bdbc-968c4e3b6a6a.jpg",
    gallery: [
      "/dogs/Roxanne/9c1a3eda-11e9-4bb6-bdbc-968c4e3b6a6a.jpg",
      "/dogs/Roxanne/IMG_3102.jpg",
      "/dogs/Roxanne/IMG_3103.JPG",
    ],
  },
  {
    id: "sebastian",
    name: "Sebastian",
    breed: "To be determined",
    age: "To be determined",
    sex: "Male",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Meet Sebastian! More details coming soon. This sweet pup is waiting for their forever home.",
    image: "/dogs/Sebastian /IMG_3107.jpg",
    gallery: [
      "/dogs/Sebastian /IMG_3107.jpg",
      "/dogs/Sebastian /IMG_3108.jpg",
      "/dogs/Sebastian /IMG_3109.jpg",
      "/dogs/Sebastian /IMG_3110.jpg",
      "/dogs/Sebastian /IMG_3111.jpg",
      "/dogs/Sebastian /IMG_3112.jpg",
      "/dogs/Sebastian /IMG_3113.jpg",
    ],
  },
  {
    id: "tony",
    name: "Tony",
    breed: "To be determined",
    age: "To be determined",
    sex: "Male",
    size: "Medium",
    location: "Sunrise Sanctuary, PR",
    description:
      "Meet Tony! More details coming soon. This sweet pup is waiting for their forever home.",
    image: "/dogs/Tony/IMG_3179.jpg",
    gallery: [
      "/dogs/Tony/IMG_3179.jpg",
      "/dogs/Tony/IMG_3180.jpg",
      "/dogs/Tony/IMG_3181.jpg",
      "/dogs/Tony/IMG_3182.jpg",
      "/dogs/Tony/IMG_3183.jpg",
      "/dogs/Tony/IMG_3184.jpg",
      "/dogs/Tony/IMG_3186.jpg",
      "/dogs/Tony/IMG_3187.jpg",
      "/dogs/Tony/IMG_3188.jpg",
      "/dogs/Tony/IMG_3189.jpg",
      "/dogs/Tony/IMG_3190.jpg",
      "/dogs/Tony/IMG_3191.jpg",
      "/dogs/Tony/IMG_3192.jpg",
      "/dogs/Tony/IMG_3195.jpg",
    ],
  },
];

export function getDogs(): Dog[] {
  return dogs;
}

export function getDog(id: string): Dog | undefined {
  return dogs.find((d) => d.id === id);
}
