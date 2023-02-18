const bcrypt = require("bcrypt");

const Employee = require("../models/Empmodels");

const authenticate = async (req, res, next) => {
    if (req.signedCookies.id) {
        req.body.user = await Employee.findById(req.signedCookies.id);
        next();
    } else {
        res.redirect("/login");
    }
};

const login = async (req, res, next) => {
    const emp = await Employee.findOne({ email: req.body.email });
    if (emp) {
        const verified = await bcrypt.compare(req.body.password, emp.password);
        if (verified) {
            res.cookie("id", emp._id.toString(), { httpOnly: true, signed: true });
            // const category = req.body.category;
            if (emp.category === 'rider') {
                res.redirect('/rider');
            } else if (emp.category === 'vendor') {
                res.redirect('/vendor');
            }
        } else res.json({ err: "Incorrect username or password" });
    } else {
        res.json("Email does not exists");
    }
};

// const logout = (req, res, next) => {
//     if (req.signedCookies.id) {
//         res.clearCookie("id", { httpOnly: true, signed: true });
//         res.redirect("/login");
//         res.json({ msg: "Logged out successfully" });
//     } else {
//         res.json({ err: "Login first !" });
//     }
// };

const index = (req, res, next) => {
    Employee.find({})
        .then((response) => {
            res.json({
                response,
            });
        })
        .catch((error) => {
            res.json({
                message: " An error Occured!",
            });
        });
};
const show = (req, res, next) => {
    res.json(req.body.user);
};
const store = async (req, res, next) => {
    const { name, email, category } = req.body;
    // if referral code is entered by user
    // if (refto) {
    //     const reftoemp = await Employee.findOne({ refCode: refto });
    //     if (!reftoemp) {
    //         res.json({ err: "Incorrect referral code" });
    //     } else {
    //         reftoemp.nReferred += 10;
    //         await reftoemp.save();
    //     }
    // }

    const password = await bcrypt.hash(req.body.password, 10);
    // let refCode = rfg.alphaNumeric("uppercase", 3, 1),
    //     exists = true;

    // // generate new referral code if another user with same referral code exists
    // while (exists) {
    //     const temp = await Employee.findOne({ refCode });
    //     if (temp) {
    //         exists = true;
    //         refCode = rfg.alphaNumeric("uppercase", 3, 1);
    //     } else {
    //         exists = false;
    //     }
    // }
    // const nReferred = 100;

    // check if another user with same email id exists
    const tempEmp = await Employee.findOne({ email });
    console.log(tempEmp);
    if (!tempEmp) {
        let employee = await Employee.create({ name, email, category, password });
        console.log(employee);
        res.cookie("id", employee._id.toString(), { httpOnly: true, signed: true });
        if (employee.category === 'rider') {
            res.redirect('/rider');
        } else if (employee.category === 'vendor') {
            res.redirect('/vendor');
        }
    } else {
        return res.redirect("/register");
    }
};

// const update = (req, res, next) => {
//     let employeeId = req.body.employeeId;
//     let updatedData = {
//         name: req.body.name,
//         designation: req.body.designation,
//         email: req.body.email,
//         phone: req.body.phone,
//         age: req.body.age,
//     };
//     Employee.findByIdAndUpdate(req.signedCookies.id, { $set: updatedData })
//         .then(() => {
//             res.json({
//                 message: "Employee updated Successfully!",
//             });
//         })
//         .catch((error) => {
//             res.json({
//                 message: "An error Occured!",
//             });
//         });
// };

module.exports = {
    index,
    show,
    store,
    authenticate,
    login,
    //logout
};
