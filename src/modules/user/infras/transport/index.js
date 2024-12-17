
const env = process.env;
const jwt = require('jsonwebtoken');
const { getAll, create, update,find,remove,findAccount } = require('../../usecase/index');
const { Resend } = require('resend');
const user = require("../../model/user");
const resend = new Resend("re_Ktfm6B7S_L1kSAHcHAmZaxmDKJkiYKvia");
async function get(req, res, next) {
    try {

        res.json(await getAll())

    } catch (error) {
        console.log("error", error)
    }
}
function generateAccessToken(user) {
    console.log(user);
    return jwt.sign(user, env.SECRET, { expiresIn: "1h" });
}
function decodedAccess(token) {
    return jwt.verify(token,process.env.SECRET);
};

function logout(req, res, next) {
    res.clearCookie('jwt').status(200).send('succesull');
}
async function findUser(req, res, next) {
    try {
        const user = await find(req.body);
        if (user !== undefined) {
            if (user.status === "unactive") {
                res.send('unactive').status(400);
            } else {
                const {User_Name,role,status} =user;
                console.log(User_Name,role,status);
                const token = generateAccessToken({User_Name,role,status});
                res.cookie('jwt', token, {
                    sameSite: 'None',
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600000,
                }).status(200).json(user);
            }
        }
        else {
            res.status(400).send("invalid details");
        }

    } catch (error) {
        console.log("error", error)
    }
}
async function createUser(req, res, next) {
    try {
        if (!find(req.body)) {
            res.status("400");
            res.send("Invalid details!");
        }
        else {
            const verify = generateAccessToken(req.body);
            res.cookie("Verify", verify,
                {
                    sameSite: 'None',
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600000,
                }).status(200).json(verify);
        }

    } catch (error) {
        console.log("error", error)
    }
}
async function verifyMail(req, res, next) {
    const verify = req.cookies['verify'];
    console.log(req.body.code);
    const acceptAccount = decodedAccess(verify);
    console.log(acceptAccount);
    const {User_Name,password,mail,code} =acceptAccount;
    if (code == req.body.code) {
    const data =await create({User_Name,password,mail});
    if(data){
        res.send("successfully").status(200);
    }}

}
async function sendMail(req, res, next) {
    try {
        if (await findAccount(req.body)) {
            res.send("Invalid details!").status(400);
        }
        else
        {
            const code = Math.floor(1000 + Math.random() * 9000);
            const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
            if (validEmail.test(req.body.mail)) {
                const { data, error } = await resend.emails.send({
                    from: "Acme <onboarding@resend.dev>",
                    to: req.body.mail,
                    subject: "Vandong is comming",
                    html: `<strong>it works!</strong>
                    <h1> Code is you ${code}</h1>
                    <button>Please Click Me</button>`,
                });

                if (error) {
                    res.send(error);
                }
                const Verify = generateAccessToken({
                    ...req.body,
                    code: code
                });
                res.cookie("verify", Verify,
                    {
                        sameSite: 'None',
                        httpOnly: true,
                        secure: true,
                        maxAge: 3600000,
                    }).status(200).json(Verify);
            }
            else {
                res.status(400).send("email not valid" + "  " + req.body.mail);

            }

        }
    }
    catch (error) {
        console.log("error", error)
    }
}
async function updateUser(req, res, next) {
    try {
        res.json(await update(req.params.id, req.body))
    } catch (error) {
        console.log("error", error)
    }
}

async function Remove(req, res) {
    try {
       const data=await remove(req.params.id);
        res.json(data).status(200);
    } catch (error) {
        throw error;
    }
}

const getUsersWithPagination = async (req, res) => {
    // Get page and size from query parameters, default to page 1 and size 10
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    // Calculate the offset based on the current page and size
    const offset = (page - 1) * size;

    try {
        // Fetch users from the database with limit and offset
        const users = await user.findAndCountAll({
            limit: size,
            offset: offset,
            order: [['createdAt', 'DESC']], // Optional: ordering users by creation date
        });

        // Return paginated response
        res.status(200).json({
            total: users.count, // Total number of users
            pages: Math.ceil(users.count / size), // Total number of pages
            currentPage: page,
            users: users.rows, // The paginated users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = {
    get,
    createUser,
    updateUser,
    findUser,
    logout,
    sendMail,
    verifyMail,
    Remove,
    getUsersWithPagination
}