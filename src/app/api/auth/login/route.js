import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await dbConnect();
 
  const { userName, password } = await req.json();
  console.log('usrName', userName);
  
  const user = await User.findOne({ userName: userName });
  console.log('user', user);
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 400 });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

  // Set the token as an HTTP-only cookie
  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Strict`
  );
 
  // Respond with the user data and token
  return new Response(
    JSON.stringify({
      message: 'Login successful',
      user: {
        id: user._id,
        userName: user.userName,
        name: user.name,
      },
      token
    }),
    { status: 200, headers }
  );
}





// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET;

// export async function POST(req) {
//   await dbConnect();
 
//   const { email, password } = await req.json();
  

//   const user = await User.findOne({ email });
//   if (!user) {
//     return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 400 });
//   }

//   const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });


//   // return new Response(JSON.stringify({ message: 'Login successful', token ,user}), { status: 200 });




//    // Set the token as an HTTP-only cookie
//    const headers = new Headers();
//    headers.append(
//      'Set-Cookie',
//      `token=${token}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Strict`
//    );
 
//    // Respond with the user data and token
//    return new Response(
//      JSON.stringify({
//        message: 'Login successful',
//        user: {
//          id: user._id,
//          email: user.email,
//          name: user.name,
//        },
//        token
//      }),
//      { status: 200, headers }
//    );
 
   
// }
