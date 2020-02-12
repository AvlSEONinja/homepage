import React, { Component } from "react";
import TodoEntry from "./TodoEntry";
import "../styles/TodoBox.scss";

interface TodoEntryState {
  text: string;
  done: boolean;
  id: string;
}

interface TodoBoxState {
  entries: Array<TodoEntryState>;
}

class TodoBox extends Component<any, TodoBoxState> {
  state = { entries: new Array<TodoEntryState>() };

  saveTodoList = () => {
    localStorage.setItem("todo-list", JSON.stringify(this.state.entries));
  };

  componentDidMount() {
    const todo = localStorage.getItem("todo-list");
    if (todo !== null) {
      const entries = JSON.parse(todo);
      this.setState({ entries });
    } else {
      this.saveTodoList();
    }
  }

  handleInputKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.keyCode === 13) {
      const value = (e.target as any).value as string;

      if (value.trim().length === 0) {
        return;
      }

      let id = "";

      do {
        id =
          Math.random()
            .toString(36)
            .substring(2, 12) +
          Math.random()
            .toString(36)
            .substring(2, 12) +
          Math.random()
            .toString(36)
            .substring(2, 12) +
          Math.random()
            .toString(36)
            .substring(2, 12);
      } while (
        // eslint-disable-next-line
        this.state.entries.filter(entry => entry.id === id).length !== 0
      );

      const entries = this.state.entries;
      entries.push({ text: value, done: false, id });
      this.setState({ entries });
      this.saveTodoList();
      (e.target as any).value = "";
    }
  };

  handleDelete = async (id: string) => {
    let entries = this.state.entries;
    entries = entries.filter(value => value.id !== id);
    await this.setState({ entries });
    this.saveTodoList();
  };

  handleDoneToggle = async (id: string, done: boolean) => {
    let entries = this.state.entries;
    entries = entries.map(value => {
      if (value.id === id) value.done = done;

      return value;
    });
    await this.setState({ entries });
    this.saveTodoList();
  };

  render() {
    return (
      <div id="todo-box" className="homepage-card">
        <h4>TODO:</h4>
        <input
          id="todo-new-entry"
          className=""
          type="text"
          placeholder="Add new things to your TODO"
          autoComplete="off"
          onKeyUp={this.handleInputKey}
        />
        <div>
          {this.state.entries.map(entry => (
            <TodoEntry
              onDelete={this.handleDelete}
              onDoneToggle={this.handleDoneToggle}
              text={entry.text}
              done={entry.done}
              id={entry.id}
              key={entry.id}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default TodoBox;
