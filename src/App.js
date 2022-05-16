import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function Header({ title, onChangeMode }) {
  return (
    <header>
      <h1 className="main-title">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onChangeMode();
          }}
        >
          {title}
        </a>
      </h1>
      <p className="sub-title">만들고 읽고 수정하고 삭제하기</p>
    </header>
  );
}
function Nav({ topics, onChange }) {
  return (
    <nav>
      <ul className="list-wrap">
        {topics.map((item) => (
          <li key={item.id}>
            <a
              id={item.id}
              href={"/read" + item.id}
              onClick={(e) => {
                e.preventDefault();
                onChange(Number(e.target.id));
              }}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
function Article({ title, body }) {
  return (
    <article className="main-content">
      <h2 className="main-content-title">{title}</h2>
      <p className="main-content-des">{body}</p>
    </article>
  );
}
function Create(props) {
  return (
    <article className="create-pad">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const body = e.target.body.value;
          props.onCreate(title, body);
        }}
      >
        <p>
          <input
            className="create-title"
            type="text"
            name="title"
            placeholder="제목을 입력하세요."
          ></input>
        </p>
        <p>
          <textarea
            name="body"
            placeholder="오늘 하루 기록하고 싶은 내용을 써주세요. *^^*"
          ></textarea>
        </p>
        <p>
          <input type="submit" value="만들기" className="create-btn"></input>
        </p>
      </form>
    </article>
  );
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <article className="update-pad">
      <form
        className="update-form"
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const body = e.target.body.value;
          props.onUpdate(title, body);
        }}
      >
        <p>
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></input>
        </p>
        <p>
          <textarea
            value={body}
            name="body"
            placeholder="내용을 입력하세요."
            onChange={(e) => {
              setBody(e.target.value);
            }}
          ></textarea>
        </p>
        <p className="update-btn-wrap">
          <input className="update-btn" type="submit" value="수정하기"></input>
        </p>
      </form>
    </article>
  );
}

function App() {
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {
      id: 1,
      title: "오늘의 일기",
      body: "🍔 오늘은 아침 11시에 일어나서 버거킹을 시켜먹었다. 새로나온 도넛 치킨 버거를 먹었는데 맛없었다",
    },
    {
      id: 2,
      title: "오늘의 음악",
      body: "🎵 내가 요즘 좋아하는 노래는 Weeknd-Out Of Time 이랑 Every summer time이다.",
    },
    {
      id: 3,
      title: "오늘의 공부",
      body: "💻 오늘은 생활코딩 리액트 강의를 보고 CRUD 기능을 구현해봤다.",
    },
  ]);

  let content = null;
  let contextControl = null;
  let contextCreate = null;
  if (mode === "WELCOME") {
    content = (
      <Article
        title="환영합니다😎"
        body="아래 + 만들기 버튼을 눌러 게시글을 작성해보세요."
      />
    );
    contextCreate = (
      <>
        <li className="create">
          <a
            href="/create"
            onClick={(e) => {
              e.preventDefault();
              setMode("CREATE");
            }}
          >
            + 만들기
          </a>
        </li>
      </>
    );
  } else if (mode === "READ") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    contextControl = (
      <div className="control-wrap">
        <li className="control">
          <a
            href={"/update" + id}
            onClick={(e) => {
              e.preventDefault();
              setMode("UPDATE");
            }}
          >
            수정하기
          </a>
        </li>
        <li>
          <input
            className="button"
            type="button"
            value="삭제하기"
            onClick={() => {
              const newTopics = [];
              for (let i = 0; i < topics.length; i++) {
                if (topics[i].id !== id) {
                  newTopics.push(topics[i]);
                }
              }
              setTopics(newTopics);
              setMode("WELCOME");
            }}
          ></input>
        </li>
      </div>
    );
    content = <Article title={title} body={body} />;
  } else if (mode === "CREATE") {
    content = (
      <Create
        onCreate={(title, body) => {
          const newTopic = { id: nextId, title: title, body: body };
          const newTopics = [...topics];
          newTopics.push(newTopic);
          setTopics(newTopics);
          setMode("READ");
          setId(nextId);
          setNextId(nextId + 1);
        }}
      />
    );
  } else if (mode === "UPDATE") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = (
      <Update
        title={title}
        body={body}
        onUpdate={(title, body) => {
          const newTopics = [...topics];
          const updatedTopic = { id: id, title: title, body: body };
          for (let i = 0; i < newTopics.length; i++) {
            if (newTopics[i].id === id) {
              newTopics[i] = updatedTopic;
              break;
            }
          }
          setTopics(newTopics);
          setMode("READ");
        }}
      />
    );
  }

  return (
    <div>
      <Header
        title='" 만읽수삭 앱 "'
        onChangeMode={() => {
          setMode("WELCOME");
        }}
      />
      <Nav
        topics={topics}
        onChange={(id) => {
          setMode("READ");
          setId(id);
        }}
      />
      {content}
      <ul className="modify">
        {contextCreate}
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
