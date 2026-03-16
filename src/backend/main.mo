import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type Project = {
    title : Text;
    description : Text;
    year : Nat;
  };

  module Project {
    public func compare(p1 : Project, p2 : Project) : Order.Order {
      Text.compare(p1.title, p2.title);
    };
  };

  type Award = {
    title : Text;
    year : Nat;
    won : Bool;
  };

  module Award {
    public func compare(a1 : Award, a2 : Award) : Order.Order {
      Text.compare(a1.title, a2.title);
    };
  };

  type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
  };

  module ContactMessage {
    public func compareByName(m1 : ContactMessage, m2 : ContactMessage) : Order.Order {
      Text.compare(m1.name, m2.name);
    };
  };

  var bio : Text = "Default bio";

  public shared ({ caller }) func updateBio(newBio : Text) : async () {
    bio := newBio;
  };

  public query ({ caller }) func getBio() : async Text {
    bio;
  };

  let projects = List.empty<Project>();

  public shared ({ caller }) func addProject(title : Text, description : Text, year : Nat) : async () {
    let project : Project = {
      title;
      description;
      year;
    };
    projects.add(project);
  };

  public query ({ caller }) func getProjects() : async [Project] {
    projects.toArray().sort();
  };

  let awards = List.empty<Award>();

  public shared ({ caller }) func addAward(title : Text, year : Nat, won : Bool) : async () {
    let award : Award = {
      title;
      year;
      won;
    };
    awards.add(award);
  };

  public query ({ caller }) func getAwards() : async [Award] {
    awards.toArray().sort();
  };

  let contactMessages = List.empty<ContactMessage>();

  public shared ({ caller }) func submitContactMessage(name : Text, email : Text, message : Text) : async () {
    let newMessage : ContactMessage = {
      name;
      email;
      message;
    };
    contactMessages.add(newMessage);
  };

  public query ({ caller }) func getContactMessages() : async [ContactMessage] {
    contactMessages.toArray().sort(ContactMessage.compareByName);
  };

  type Portfolio = {
    bio : Text;
    projects : [Project];
    awards : [Award];
  };

  let portfolios = Map.empty<Text, Portfolio>();

  public shared ({ caller }) func initializePortfolios() : async () {
    portfolios.add(
      "Alice",
      {
        bio = "Alice-Bio";
        projects = [{ title = "project 1 - Alice"; description = "description 1 - Alice"; year = 2021 }];
        awards = [{ title = "award 1 - Alice"; year = 2022; won = true }];
      },
    );
    portfolios.add(
      "Bob",
      {
        bio = "Bob-Bio";
        projects = [{ title = "project 1 - Bob"; description = "description 1 - Bob"; year = 2021 }];
        awards = [{ title = "award 1 - Bob"; year = 2022; won = true }];
      },
    );
    portfolios.add(
      "Charlie",
      {
        bio = "Charlie-Bio";
        projects = [{ title = "project 1 - Charlie"; description = "description 1 - Charlie"; year = 2021 }];
        awards = [{ title = "award 1 - Charlie"; year = 2022; won = true }];
      },
    );
    portfolios.add(
      "David",
      {
        bio = "David-Bio";
        projects = [{ title = "project 1 - David"; description = "description 1 - David"; year = 2021 }];
        awards = [{ title = "award 1 - David"; year = 2022; won = true }];
      },
    );
    portfolios.add(
      "Eve",
      {
        bio = "Eve-Bio";
        projects = [{ title = "project 1 - Eve"; description = "description 1 - Eve"; year = 2021 }];
        awards = [{ title = "award 1 - Eve"; year = 2022; won = true }];
      },
    );
  };

  public query ({ caller }) func getPortfolioByName(name : Text) : async Portfolio {
    switch (portfolios.get(name)) {
      case (null) { Runtime.trap("Portfolio does not exist") };
      case (?portfolio) { portfolio };
    };
  };
};
