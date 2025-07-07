import logo from './logo.png'
import mainbg from './main-bg.png'
import textlogo from './text-logo.svg'
import defaultImg from './default-img.png'
import defaultUser from './default-user.png'
import welcomeVideo from './welcome.mp4'
export const assets = {
    logo,
    textlogo,
    mainbg,
    defaultImg,
    defaultUser,
    welcomeVideo
}

export const category_list = [
    {
        category_name: "Body Massage",
        category_image: defaultImg
    },
    {
        category_name: "Facial",
        category_image: defaultImg
    },
    {
        category_name: "Aromatherapy",
        category_image: defaultImg
    },
    {
        category_name: "Thai Massage",
        category_image: defaultImg
    },
    {
        category_name: "Sport Massage",
        category_image: defaultImg
    },
    {
        category_name: "Swedish Massage",
        category_image: defaultImg
    }
]

// user card
export const userData = [
  {
    id: 1,
    name: "Alice",
    phone: "123-456-7890",
    email: "alice@example.com",
    password: "alice123",
    type: "admin",
    image: defaultUser,
  },
  {
    id: 5,
    name: "Alice",
    phone: "123-456-7890",
    email: "alice@example.com",
    password: "alice123",
    type: "admin",
    image: defaultUser,
  },
  {
    id: 2,
    name: "Bob",
    phone: "987-654-3210",
    email: "bob@example.com",
    password: "bob123",
    type: "user",
    image: defaultUser,
  },
  {
    id: 3,
    name: "Charlie",
    phone: "456-789-0123",
    email: "charlie@example.com",
    password: "charlie123",
    type: "Sheff",
    image: defaultUser,
  },
  {
    id: 4,
    name: "Diana",
    phone: "789-012-3456",
    email: "diana@example.com",
    password: "diana123",
    type: "user",
    image: defaultUser,
  },
];
