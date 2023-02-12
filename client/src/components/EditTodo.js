import React, { Fragment, useState } from "react";

const EditTodo = ({ todo }) => {
    const [description, setDescription] = useState(todo.description);

    // Update description function name(params) {
    const updateDescription = async () => {
        try {
            const body = { description }
            const response = await fetch(`https://antisago.com/todos/${todo.todo_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            window.location = "/";
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <Fragment>
            <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#id${todo.todo_id}`}>
                Edit
            </button>
            <div className="modal" id={`id${todo.todo_id}`} onClick={() => setDescription(todo.description)}>
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Edit Todo</h4>
                            <button type="button" className="close" onClick={() => setDescription(todo.description)} data-dismiss="modal">&times;</button>
                        </div>

                        <div className="modal-body">
                            <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-warning" onClick={e => updateDescription(e)} data-dismiss="modal">Edit</button>
                            <button type="button" className="btn btn-danger" onClick={() => setDescription(todo.description)} data-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default EditTodo;
