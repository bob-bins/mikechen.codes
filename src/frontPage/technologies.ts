import { a, div, h1, img } from "@hyperapp/html"
import { text } from "hyperapp"
import aws_logo from "./logos/aws_logo.svg"
import bash_logo from "./logos/bash_logo.svg"
import c_language_logo from "./logos/c_language_logo.svg"
import cassandra_logo from "./logos/cassandra_logo.svg"
import docker_icon from "./logos/docker_icon.svg"
import github_actions_logo from "./logos/github_actions_logo.svg"
import gitlab_logo from "./logos/gitlab_logo.svg"
import helm_logo from "./logos/helm_logo.svg"
import hyperapp_logo from "./logos/hyperapp_logo.svg"
import jenkins_logo from "./logos/jenkins_logo.svg"
import kafka_logo from "./logos/kafka_logo.svg"
import kubernetes_logo from "./logos/kubernetes_logo.svg"
import linkerd_logo from "./logos/linkerd_logo.svg"
import nodejs_logo from "./logos/nodejs_logo.svg"
import postgresql_logo from "./logos/postgresql_logo.svg"
import pulumi_logo from "./logos/pulumi_logo.svg"
import purescript_logo from "./logos/purescript_logo.svg"
import python_logo from "./logos/python_logo.svg"
import react_logo from "./logos/react_logo.svg"
import redis_logo from "./logos/redis_logo.svg"
import rxjs_logo from "./logos/rxjs_logo.svg"
import scala_logo from "./logos/scala_logo.svg"
import tensorflowjs_logo from "./logos/tensorflowjs_logo.svg"
import terraform_logo from "./logos/terraform_logo.svg"
import typescript_logo from "./logos/typescript_logo.svg"

const clickableLogo = (src: string, alt: string, href: string) =>
  a(
    {
      class: "m-3 align-self-center zoomOnHover",
      href,
      target: "_blank",
      title: alt,
      "data-toggle": "tooltip",
    },
    img({
      class: "card-img-top",
      loading: "lazy",
      style: {
        width: `75px`,
        height: `75px`,
      },
      src,
      alt,
    })
  )

const technologiesMetadata = [
  {
    name: "TypeScript",
    favorite: true,
    url: "https://www.typescriptlang.org/",
    logo: typescript_logo,
  },
  {
    name: "C Language",
    favorite: false,
    url: "https://en.wikipedia.org/wiki/C_(programming_language)",
    logo: c_language_logo,
  },
  {
    name: "Python",
    favorite: false,
    url: "https://www.python.org/",
    logo: python_logo,
  },
  {
    name: "Bash",
    favorite: false,
    url: "https://www.gnu.org/software/bash/",
    logo: bash_logo,
  },
  {
    name: "Scala",
    favorite: false,
    url: "https://www.scala-lang.org/",
    logo: scala_logo,
  },
  {
    name: "PureScript",
    favorite: false,
    url: "https://www.purescript.org/",
    logo: purescript_logo,
  },
  {
    name: "GitLab CI",
    favorite: true,
    url: "https://docs.gitlab.com/ee/ci/",
    logo: gitlab_logo,
  },
  {
    name: "GitHub Actions",
    favorite: true,
    url: "https://github.com/features/actions",
    logo: github_actions_logo,
  },
  {
    name: "Jenkins",
    favorite: false,
    url: "https://www.jenkins.io/",
    logo: jenkins_logo,
  },
  {
    name: "Docker",
    favorite: false,
    url: "https://www.docker.com/",
    logo: docker_icon,
  },
  {
    name: "Helm",
    favorite: false,
    url: "https://helm.sh/",
    logo: helm_logo,
  },
  {
    name: "Kubernetes (K8s)",
    favorite: true,
    url: "https://kubernetes.io/",
    logo: kubernetes_logo,
  },
  {
    name: "Linkerd",
    favorite: true,
    url: "https://linkerd.io/",
    logo: linkerd_logo,
  },
  {
    name: "Pulumi",
    favorite: true,
    url: "https://www.pulumi.com/",
    logo: pulumi_logo,
  },
  {
    name: "Terraform",
    favorite: false,
    url: "https://www.terraform.io/",
    logo: terraform_logo,
  },
  {
    name: "Hyperapp",
    favorite: true,
    url: "https://github.com/jorgebucaran/hyperapp",
    logo: hyperapp_logo,
  },
  {
    name: "ReactJS",
    favorite: true,
    url: "https://reactjs.org/",
    logo: react_logo,
  },
  {
    name: "NodeJS",
    favorite: false,
    url: "https://nodejs.org/",
    logo: nodejs_logo,
  },
  {
    name: "RxJS",
    favorite: true,
    url: "https://rxjs.dev/",
    logo: rxjs_logo,
  },
  {
    name: "Amazon Web Services (AWS)",
    favorite: false,
    url: "https://aws.amazon.com/",
    logo: aws_logo,
  },
  {
    name: "Cassandra",
    favorite: false,
    url: "https://cassandra.apache.org/",
    logo: cassandra_logo,
  },
  {
    name: "PostgreSQL",
    favorite: false,
    url: "https://www.postgresql.org/",
    logo: postgresql_logo,
  },
  {
    name: "Kafka",
    favorite: false,
    url: "https://kafka.apache.org/",
    logo: kafka_logo,
  },
  {
    name: "Redis",
    favorite: false,
    url: "https://redis.io/",
    logo: redis_logo,
  },
  {
    name: "TensorFlow.js",
    favorite: false,
    url: "https://www.tensorflow.org/js",
    logo: tensorflowjs_logo,
  },
]

export const technologiesId = "Technologies"
export const technologies = () =>
  div({ class: "jumbotron p-5 bg-light", id: technologiesId }, [
    div({ class: "container text-center" }, [h1({}, text("Technologies"))]),
    div(
      { class: "container-fluid d-flex flex-row flex-wrap justify-content-center" },
      technologiesMetadata.map(t => clickableLogo(t.logo, t.name, t.url))
    ),
  ])
