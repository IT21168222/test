import React from "react";
import axios from "axios";

import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { setMovies } from "../../actions/actions";
import MoviesList from "../movies-list/movies-list";

import "./main-view.scss";
import { Container, Row, Col } from "react-bootstrap";

import { LoginView } from "../login-view/login-view";
import { RegistrationView } from "../registration-view/registration-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";
import { NavbarView } from "../navbar/navbar-view";
import { ProfileView } from "../profile-view/profile-view";

//export
class MainView extends React.Component {
  constructor() {
    super();
    // Initial state is set to null
    this.state = {
      //movies: [],
      user: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
    }
  }

  getMovies(token) {
    axios
      .get("https://amrizflix.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assign the result to the state
        //this.setState({
        //movies: response.data,
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  /* When a user successfully logs in, this function updates the `user` property in state to that *particular user*/
  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
    });

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
  }

  render() {
    const { movies } = this.props;
    const { user } = this.state;
    //with no user logged in LoginView will show if one is logged in the user parameters are passed as prop to LoginView

    /*If the state of `selectedMovie` is not null, that selected movie will be returned otherwise, all *movies will be returned*/
    return (
      <Router>
        <NavbarView user={user} />

        <Container>
          <Row className="main-view justify-content-md-center">
            {/* login page / main movies page */}
            <Route
              exact
              path="/"
              render={() => {
                /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are *passed as a prop to the LoginView*/
                if (!user)
                  return (
                    <Col>
                      {" "}
                      <LoginView
                        onLoggedIn={(user) => this.onLoggedIn(user)}
                      />{" "}
                    </Col>
                  );
                // Empty Mainview if there are no movies (or movies are still loading)
                if (movies.length === 0)
                  return <div className="main-view"></div>;

                return <MoviesList movies={movies} />;
              }}
            />

            {/* register page */}
            <Route
              exact
              path="/register"
              render={() => {
                if (user) return <Redirect to="/" />;
                return (
                  <Col>
                    <RegistrationView />
                  </Col>
                );
              }}
            />

            {/* profile page */}
            <Route
              path="/profile"
              render={({ history }) => {
                if (!user)
                  return (
                    <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                  );

                if (movies.length === 0)
                  return <div className="main-view"></div>;

                return (
                  <ProfileView
                    movies={movies}
                    setUser={(user) => this.setUser(user)}
                    onLoggedOut={() => this.onLoggedOut()}
                    onBackClick={() => history.goBack()}
                  />
                );
              }}
            />

            {/* movie page */}
            <Route
              path="/movies/:movieId"
              render={({ history, match }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (movies.length === 0) return <div className="main-view" />;
                return (
                  <Col md={8}>
                    <MovieView
                      movie={movies.find((m) => m._id === match.params.movieId)}
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />

            {/* director page */}
            <Route
              path="/directors/:name"
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (movies.length === 0) return <div className="main-view" />;
                return (
                  <Col md={8}>
                    <DirectorView
                      director={
                        movies.find(
                          (m) => m.Director.Name === match.params.name
                        ).Director
                      }
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />

            {/* genre page */}
            <Route
              path="/genres/:name"
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );

                if (movies.length === 0) return <div className="main-view" />;
                return (
                  <Col md={8}>
                    <GenreView
                      genre={
                        movies.find((m) => m.Genre.Name === match.params.name)
                          .Genre
                      }
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />
          </Row>
        </Container>
      </Router>
    );
  }
}

let mapStateToProps = (state) => {
  return { movies: state.movies };
};

export default connect(mapStateToProps, { setMovies })(MainView);
//export default MainView;
