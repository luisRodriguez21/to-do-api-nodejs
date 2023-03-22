import express from 'express';
import cors from 'cors';
import { 
    getToDoById,
    getTodosByID,
    getTodo,
    getSharedTodoByID,
    getUserByID,
    getUserByEmail,
    createTodo,
    deleteTodo,
    toggleCompleted,
    shareTodo
} from './db.js';



const corsOptions = {
    origin: 'https://127.0.0.1:5173/',
    methods: ['GET', 'POST'],
    credentials: true
}

const app = express();
app.use(express.json());
// app.use(cors(corsOptions));


app.get("/get/todos/by/id/user", async (req, res) => {
    const { idUser } = req.body;
    console.log("req.body: ",req.body);
    
    console.log("idUser", idUser);
    const todos = await getTodosByID(idUser);
    res.status(200).send(todos);
});

app.get("/get/todos/shared_todos", async (req, res) => {
    const { idToDo } = req.body;
    console.log("req.body: ",req.body);
    
    const todo = await getSharedTodoByID(idToDo);
    const author = await getUserByID(todo.id_user);
    const shared_with = await getUserByID(todo.shared_with_id);

    res.status(200).send({ author, shared_with });
});

app.get("/get/user/by/id", async (req, res) => {
    const { idUser } = req.body;
    console.log("req.body: ",req.body);

    const user = await getUserByID(idUser);
    res.status(200).send(user);
});

app.put("/update/todo", async (req, res) => {
    const { value, idToDo } = req.body;
    console.log("req.body: ",req.body);

    const todo = await toggleCompleted(idToDo, value);
    res.status(200).send(todo);
});

app.delete("/delete/todo", async (req, res) => {
    const { idToDo } = req.body;
    console.log("req.body: ",req.body);

    await deleteTodo(idToDo);
    res.send({ message: "Todo deleted successfully" });
});

app.post("/share/to/do", async (req, res) => {
    const { id_to_do, id_user, email } = req.body;
    console.log("req.bodyyy: ",req.body);

    const userToShare = await getUserByEmail(email);
    console.log("userToShare: ",userToShare);
    const sharedTodo = await shareTodo(id_to_do, id_user, userToShare.id_user);
    console.log("sharedTodo: ",sharedTodo);


    res.status(200).send(sharedTodo);
});


app.post("/todos", async (req, res) => {
    const { id_user, title } = req.body;
    console.log("req.body: ",req.body);

    const todo = await createTodo(id_user, title);
    res.status(201).send(todo);
});




app.listen(8080, () => {
    console.log("Server running on port 8080");
});

