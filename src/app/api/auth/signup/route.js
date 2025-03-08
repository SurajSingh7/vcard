import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET: Fetch all staff users
export async function GET(req) {
  await dbConnect();
  try {
    const users = await User.find({});
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
  }
}

// POST: Signup new staff
export async function POST(req) {
  await dbConnect();

  const { name, userName, password, mobile } = await req.json();
  console.log("mobile",mobile,name,userName);

  const existingUser = await User.findOne({ userName });
  if (existingUser) {
    return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, userName, password: hashedPassword, mobile });
    return new Response(JSON.stringify({ message: 'Signup successful', user }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to create user' }), { status: 400 });
  }
}

// PUT: Update staff user details
export async function PUT(req) {
  await dbConnect();
  try {
    const { id, name, userName, password, mobile } = await req.json();

    const user = await User.findById(id);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    if (name) user.name = name;
    if (userName) user.userName = userName;
    if (mobile !== undefined) user.mobile = mobile;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return new Response(JSON.stringify({ message: 'User updated successfully', user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to update user' }), { status: 500 });
  }
}

// DELETE: Remove a staff user
export async function DELETE(req) {
  await dbConnect();
  try {
    const { id } = await req.json();

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), { status: 500 });
  }
}











// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import bcrypt from 'bcryptjs';

// // GET: Fetch all staff users
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const users = await User.find({});
//     return new Response(JSON.stringify({ users }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
//   }
// }

// // POST: Signup new staff
// export async function POST(req) {
//   await dbConnect();

//   const { name, userName, password } = await req.json();

//   const existingUser = await User.findOne({ userName });
//   if (existingUser) {
//     return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({ name, userName, password: hashedPassword });

//   return new Response(JSON.stringify({ message: 'Signup successful', user }), { status: 201 });
// }

// // PUT: Update staff user details
// export async function PUT(req) {
//   await dbConnect();
//   try {
//     const { id, name, userName, password } = await req.json();

//     const user = await User.findById(id);
//     if (!user) {
//       return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
//     }

//     if (name) user.name = name;
//     if (userName) user.userName = userName;
//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       user.password = hashedPassword;
//     }

//     await user.save();

//     return new Response(JSON.stringify({ message: 'User updated successfully', user }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
//   }
// }

// // DELETE: Remove a staff user
// export async function DELETE(req) {
//   await dbConnect();
//   try {
//     const { id } = await req.json();

//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
//     }
//     return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to delete user' }), { status: 500 });
//   }
// }












// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import bcrypt from 'bcryptjs';

// // GET: Fetch all staff users
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const users = await User.find({});
//     return new Response(JSON.stringify({ users }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
//   }
// }

// // POST: Signup new staff
// export async function POST(req) {
//   await dbConnect();

//   const { name, email, password } = await req.json();

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({ name, email, password: hashedPassword });

//   return new Response(JSON.stringify({ message: 'Signup successful', user }), { status: 201 });
// }

// // PUT: Update staff user details
// export async function PUT(req) {
//   await dbConnect();
//   try {
//     const { id, name, email, password } = await req.json();

//     const user = await User.findById(id);
//     if (!user) {
//       return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
//     }

//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       user.password = hashedPassword;
//     }

//     await user.save();

//     return new Response(JSON.stringify({ message: 'User updated successfully', user }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
//   }
// }

// // DELETE: Remove a staff user
// export async function DELETE(req) {
//   await dbConnect();
//   try {
//     const { id } = await req.json();

//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
//     }
//     return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to delete user' }), { status: 500 });
//   }
// }














// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import bcrypt from 'bcryptjs';

// export async function POST(req) {
 
//   await dbConnect();

//   const { name, email, password } = await req.json();

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({ name, email, password: hashedPassword });

//   return new Response(JSON.stringify({ message: 'Signup successful', user }), { status: 201 });
// }
