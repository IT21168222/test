import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

import "./profile-view.scss";

import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {
      Username: null,
      Password: null,
      Email: null,
      Birthday: null,
      FavoriteMovies: [],
    };
  }
  componentDidMount() {
    const accessToken = localStorage.getItem("token");
    this.getUser(accessToken);
  }

  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
    window.open("/", "_self");
  }

  getUser = (token) => {
    const Username = localStorage.getItem("user");
    axios
      .get(`https://amrizflix.herokuapp.com/users/${Username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birthday,
          FavoriteMovies: response.data.FavoriteMovies,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // Allow user to edit or update profile
  editUser = (e) => {
    e.preventDefault();
    const Username = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    axios
      .put(
        `https://amrizflix.herokuapp.com/users/${Username}`,
        {
          Username: this.state.Username,
          Password: this.state.Password,
          Email: this.state.Email,
          Birthday: this.state.Birthday,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birthday,
        });

        localStorage.setItem("user", this.state.Username);
        const data = response.data;
        console.log(data);
        console.log(this.state.Username);
        alert("Profile updated");
        window.open("/users/${Username}", "_self");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Delete a movie from FavoriteMovies list
  onRemoveFavorite = (e, movie) => {
    e.preventDefault();
    const Username = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    axios
      .delete(
        `https://amrizflix.herokuapp.com/users/${Username}/movies/${movie._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(response);
        alert("Movie removed");
        this.componentDidMount();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Deregister
  onDeleteUser() {
    const Username = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    axios
      .delete(`https://amrizflix.herokuapp.com/users/${Username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        alert("Profile deleted");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.open("/", "_self");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  setUsername(value) {
    this.setState({
      Username: value,
    });
  }

  setPassword(value) {
    this.setState({
      Password: value,
    });
  }

  setEmail(value) {
    this.setState({
      Email: value,
    });
  }

  setBirthday(value) {
    this.setState({
      Birthday: value,
    });
  }

  render() {
    const { movies, onBackClick } = this.props;
    const { FavoriteMovies, Username, Email, Birthday, Password } = this.state;

    if (!Username) {
      return null;
    }

    return (
      <Container className="profile-view" align="center">
        <Row>
          <Col>
            <Card className="update-profile">
              <Card.Body>
                <Card.Title>Profile</Card.Title>
                <Form
                  className="update-form"
                  onSubmit={(e) =>
                    this.editUser(
                      e,
                      this.Username,
                      this.Password,
                      this.Email,
                      this.Birthday
                    )
                  }
                >
                  <Card>
                    <Card.Body></Card.Body>
                  </Card>
                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="Username"
                      placeholder="New Username"
                      value={Username}
                      onChange={(e) => this.setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="Password"
                      placeholder="New Password"
                      value={Password}
                      onChange={(e) => this.setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="Email"
                      placeholder="Enter Email"
                      value={Email}
                      onChange={(e) => this.setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                      type="date"
                      name="Birthday"
                      value={Birthday}
                      onChange={(e) => this.setBirthday(e.target.value)}
                    />
                  </Form.Group>
                  <div className="mt-3">
                    <Button
                      variant="success"
                      type="submit"
                      onClick={this.editUser}
                    >
                      Update User
                    </Button>
                    <Button
                      className="ml-3"
                      variant="secondary"
                      onClick={() => this.onDeleteUser()}
                    >
                      Delete User
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br></br>
        <Row style={{ marginTop: "20px" }}>
          <Col>
            <h4>{Username} Favorite Movies</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card.Body>
              {FavoriteMovies.length === 0 && (
                <div className="text-center">No Favorite Movies</div>
              )}
              <Row className="favorite-container">
                {FavoriteMovies.length > 0 &&
                  movies.map((movie) => {
                    if (
                      movie._id ===
                      FavoriteMovies.find((fav) => fav === movie._id)
                    ) {
                      return (
                        <Card
                          className="favorite-movie card-content"
                          key={movie._id}
                        >
                          <Card.Img
                            className="fav-poster"
                            variant="top"
                            src={movie.ImagePath}
                          />
                          <Card.Body style={{ backgroundColor: "black" }}>
                            <Card.Title className="movie_title">
                              {movie.Title}
                            </Card.Title>
                            <Button
                              size="sm"
                              variant="danger"
                              value={movie._id}
                              onClick={(e) => this.onRemoveFavorite(e, movie)}
                            >
                              Remove
                            </Button>
                          </Card.Body>
                        </Card>
                      );
                    }
                  })}
              </Row>
            </Card.Body>
          </Col>
        </Row>

        <div className="backButton">
          <Button
            onClick={() => {
              onBackClick(null);
            }}
          >
            Back
          </Button>
        </div>
        <br />
      </Container>
    );
  }
}
