-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 16/08/2025 às 00:55
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `roadmap_db`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `achievement`
--

CREATE TABLE `achievement` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `icon` varchar(191) NOT NULL,
  `condition` varchar(191) NOT NULL,
  `xpReward` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `achievement`
--

INSERT INTO `achievement` (`id`, `name`, `description`, `icon`, `condition`, `xpReward`) VALUES
(1, 'Primeiro Passo', 'Complete seu primeiro tópico', '🎯', '[{\"type\": \"topics_completed_exactly\", \"value\": 1}]', 50),
(2, 'Em Movimento', 'Complete 3 tópicos', '🚶', '[{\"type\": \"topics_completed_exactly\", \"value\": 3}]', 75),
(3, 'Estudioso', 'Complete 5 tópicos', '📚', '[{\"type\": \"topics_completed_exactly\", \"value\": 5}]', 100),
(4, 'Persistente', 'Complete 10 tópicos', '💪', '[{\"type\": \"topics_completed_exactly\", \"value\": 10}]', 150),
(5, 'Dedicado', 'Complete 20 tópicos', '⭐', '[{\"type\": \"topics_completed_exactly\", \"value\": 20}]', 200),
(6, 'Mestre', 'Complete 50 tópicos', '👑', '[{\"type\": \"topics_completed_exactly\", \"value\": 50}]', 300),
(7, 'Fundamentos Concluídos', 'Complete o Nível 1 - Fundamentos da Web', '🌐', '[{\"type\": \"level_completed\", \"value\": 1}]', 100),
(8, 'HTML Master', 'Complete o Nível 2 - HTML com Maestria', '📄', '[{\"type\": \"level_completed\", \"value\": 2}]', 100),
(9, 'CSS Expert', 'Complete o Nível 3 - CSS do Básico ao Avançado', '🎨', '[{\"type\": \"level_completed\", \"value\": 3}]', 125),
(10, 'Git Ninja', 'Complete o Nível 4 - Git e GitHub', '🐙', '[{\"type\": \"level_completed\", \"value\": 4}]', 100),
(11, 'Logic Master', 'Complete o Nível 5 - Lógica de Programação', '🧠', '[{\"type\": \"level_completed\", \"value\": 5}]', 125),
(12, 'JavaScript Wizard', 'Complete o Nível 6 - JavaScript com Maestria', '⚡', '[{\"type\": \"level_completed\", \"value\": 6}]', 125),
(13, 'Consistente', 'Mantenha um streak de 3 dias', '🔥', '[{\"type\": \"streak_days\", \"value\": 3}]', 100),
(14, 'Disciplinado', 'Mantenha um streak de 7 dias', '🎖️', '[{\"type\": \"streak_days\", \"value\": 7}]', 200),
(15, 'Veterano', 'Mantenha um streak de 30 dias', '🏆', '[{\"type\": \"streak_days\", \"value\": 30}]', 500),
(16, 'Colecionador', 'Acumule 500 XP', '💰', '[{\"type\": \"total_xp\", \"value\": 500}]', 100),
(17, 'XP Master', 'Acumule 1000 XP', '💎', '[{\"type\": \"total_xp\", \"value\": 1000}]', 200),
(18, 'XP Legend', 'Acumule 2500 XP', '👑', '[{\"type\": \"total_xp\", \"value\": 2500}]', 500),
(19, 'Centena', 'Complete 100 tópicos', '💯', '[{\"type\": \"topics_completed_exactly\", \"value\": 100}]', 500),
(20, 'Maratonista', 'Complete 150 tópicos', '🏃‍♂️', '[{\"type\": \"topics_completed_exactly\", \"value\": 150}]', 750),
(21, 'Lenda', 'Complete todos os tópicos disponíveis', '🌟', '[{\"type\": \"topics_completed_exactly\", \"value\": 200}]', 1500),
(22, 'Backend Master', 'Complete o Nível 7 - Node.js Fundamentals', '⚙️', '[{\"type\": \"level_completed\", \"value\": 7}]', 150),
(23, 'Database Guru', 'Complete o Nível 8 - Bancos de Dados', '🗄️', '[{\"type\": \"level_completed\", \"value\": 8}]', 150),
(24, 'API Architect', 'Complete o Nível 9 - APIs e Integração', '🔗', '[{\"type\": \"level_completed\", \"value\": 9}]', 175),
(25, 'Framework Ninja', 'Complete o Nível 10 - Frameworks Modernos', '🥷', '[{\"type\": \"level_completed\", \"value\": 10}]', 175),
(26, 'DevOps Explorer', 'Complete o Nível 11 - DevOps e Deploy', '🚀', '[{\"type\": \"level_completed\", \"value\": 11}]', 200),
(27, 'XP Titan', 'Acumule 5000 XP', '⚡', '[{\"type\": \"total_xp\", \"value\": 5000}]', 750),
(28, 'XP God', 'Acumule 10000 XP', '🌟', '[{\"type\": \"total_xp\", \"value\": 10000}]', 1000),
(29, 'Inabalável', 'Mantenha um streak de 15 dias', '💪', '[{\"type\": \"streak_days\", \"value\": 15}]', 300),
(30, 'Imparável', 'Mantenha um streak de 60 dias', '🔥', '[{\"type\": \"streak_days\", \"value\": 60}]', 750),
(31, 'Lendário', 'Mantenha um streak de 100 dias', '👑', '[{\"type\": \"streak_days\", \"value\": 100}]', 1500),
(32, 'Velocista', 'Complete 5 tópicos em um único dia', '💨', '[{\"type\": \"topics_per_day\", \"value\": 5}]', 150),
(33, 'Relâmpago', 'Complete 10 tópicos em um único dia', '⚡', '[{\"type\": \"topics_per_day\", \"value\": 10}]', 300),
(34, 'Supersônico', 'Complete 15 tópicos em um único dia', '🚀', '[{\"type\": \"topics_per_day\", \"value\": 15}]', 500),
(35, 'Explorador', 'Complete pelo menos 1 tópico em 5 níveis diferentes', '🗺️', '[{\"type\": \"levels_touched\", \"value\": 5}]', 200),
(36, 'Aventureiro', 'Complete pelo menos 1 tópico em 10 níveis diferentes', '🎒', '[{\"type\": \"levels_touched\", \"value\": 10}]', 350),
(37, 'Desbravador', 'Complete pelo menos 1 tópico em todos os 21 níveis', '🧭', '[{\"type\": \"levels_touched\", \"value\": 21}]', 750),
(38, 'Frontend Developer', 'Complete os níveis básicos de Frontend (1-3, 6)', '🎨', '[{\"type\": \"specific_levels_completed\", \"value\": [1, 2, 3, 6]}]', 400),
(39, 'Backend Developer', 'Complete os níveis de Backend (4, 5, 7, 8, 9)', '⚙️', '[{\"type\": \"specific_levels_completed\", \"value\": [4, 5, 7, 8, 9]}]', 600),
(40, 'Full Stack Developer', 'Complete todos os níveis principais (1-12)', '🚀', '[{\"type\": \"specific_levels_completed\", \"value\": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}]', 1000),
(41, 'Internacional', 'Complete os níveis de soft skills e inglês', '🌍', '[{\"type\": \"specific_levels_completed\", \"value\": [19, 20, 21]}]', 500),
(42, 'Primeiro Nível', 'Complete seu primeiro nível completo', '🥇', '[{\"type\": \"levels_completed_exactly\", \"value\": 1}]', 150),
(43, 'Trio de Ouro', 'Complete 3 níveis completos', '🥉', '[{\"type\": \"levels_completed_exactly\", \"value\": 3}]', 300),
(44, 'Meia Dúzia', 'Complete 6 níveis completos', '🎯', '[{\"type\": \"levels_completed_exactly\", \"value\": 6}]', 500),
(45, 'Dezena Dourada', 'Complete 10 níveis completos', '🏆', '[{\"type\": \"levels_completed_exactly\", \"value\": 10}]', 750),
(46, 'Completista', 'Complete todos os 21 níveis', '👑', '[{\"type\": \"levels_completed_exactly\", \"value\": 21}]', 2000),
(47, 'Madrugador', 'Complete um tópico antes das 8h', '🌅', '[{\"type\": \"early_bird\", \"value\": 8}]', 100),
(48, 'Coruja', 'Complete um tópico depois das 22h', '🦉', '[{\"type\": \"night_owl\", \"value\": 22}]', 100),
(49, 'Fim de Semana', 'Complete 5 tópicos no fim de semana', '🏖️', '[{\"type\": \"weekend_warrior\", \"value\": 5}]', 200);

-- --------------------------------------------------------

--
-- Estrutura para tabela `analytics`
--

CREATE TABLE `analytics` (
  `id` int(11) NOT NULL,
  `metric` varchar(191) NOT NULL,
  `value` double NOT NULL,
  `date` datetime(3) NOT NULL,
  `metadata` varchar(191) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `badge`
--

CREATE TABLE `badge` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `icon` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `badge`
--

INSERT INTO `badge` (`id`, `name`, `description`, `icon`, `category`) VALUES
(1, 'Nível 1 — Fundamentos da Web e da Internet', 'Conquistou o conhecimento fundamental de como a internet funciona por trás dos navegadores.', '🌐', 'level'),
(2, 'Nível 2 — HTML com Maestria', 'Dominou a construção estrutural de páginas com HTML semântico, limpo e acessível.', '🧱', 'level'),
(3, 'Nível 3 — CSS do Básico ao Avançado', 'Domina completamente a estilização de páginas com CSS, incluindo responsividade e layout moderno.', '🎨', 'level'),
(4, 'Nível 4 — Git e GitHub', 'Controla o histórico do seu código como um ninja do Git e colabora em alto nível com GitHub.', '🧬', 'level'),
(5, 'Nível 5 — Lógica e Algoritmos', 'Pensamento lógico afiado, domina a construção de algoritmos e resolução de problemas.', '🧠', 'level'),
(6, 'Nível 6 — JavaScript com Maestria', 'Domina a linguagem da web com fluidez em lógica, DOM, ES6+ e integração com a web moderna.', '🪄', 'level'),
(7, 'Nível 7 — TypeScript Profissional', 'Domina TypeScript, trazendo segurança e robustez para projetos modernos com JS.', '🛡️', 'level'),
(8, 'Nível 8 — React', 'Cria aplicações modernas e reativas com componentes, hooks e roteamento.', '⚛️', 'level'),
(9, 'Nível 9 — Node.js com Express', 'Domina o backend com Node.js, rotas, middlewares e construção de APIs robustas.', '🔥', 'level'),
(10, 'Nível 10 — Banco de Dados', 'Sabe modelar, manipular e consultar dados em bancos relacionais e NoSQL.', '🗄️', 'level'),
(11, 'Nível 11 — NestJS', 'Cria APIs escaláveis com injeção de dependência, validações e arquitetura robusta.', '🧩', 'level'),
(12, 'Nível 12 — APIs RESTful', 'Domina a criação e consumo de APIs REST com padrões profissionais e segurança.', '📨', 'level'),
(13, 'Nível 13 — Autenticação e Autorização', 'Sabe proteger sistemas com JWT, roles e autenticação sólida.', '🔐', 'level'),
(14, 'Nível 14 — Deploy e DevOps Básico', 'Consegue colocar seus projetos no ar com CI/CD, hospedagem e bancos na nuvem.', '🚀', 'level'),
(15, 'Nível 15 — C# com ASP.NET Core', 'Domina a criação de APIs modernas com ASP.NET, orientação a objetos e boas práticas.', '🛡️⚔️', 'level'),
(16, 'Nível 16 — Java com Spring Boot', 'Cria sistemas sólidos com Spring Boot, injeção de dependência e JPA.', '🥷☕', 'level'),
(17, 'Nível 17 — Clean Code e Testes', 'Escreve código limpo, modular e testável seguindo padrões profissionais.', '🧼🧪', 'level'),
(18, 'Nível 18 — Microserviços', 'Sabe quebrar sistemas em serviços independentes com Docker, mensageria e APIs.', '🎻', 'level'),
(19, 'Nível 19 — Soft Skills e Produtividade', 'Gerencia tarefas com eficiência, colabora bem em times e se comunica com clareza.', '🧭', 'level'),
(20, 'Nível 20 — Inglês Técnico e Profissional', 'Apresenta projetos, participa de reuniões e entrevistas em inglês com confiança.', '🗣️🌍', 'level'),
(21, 'Nível 21 — Preparação para o Mercado Internacional', 'Está pronto para atuar em empresas no exterior, com currículo, portfólio e GitHub profissional.', '🧳💼', 'level'),
(22, 'Full-Stack Master Internacional', 'Concluiu o roadmap completo, preparado para qualquer desafio técnico ou cultural.', '🧠👨‍💻🌍', 'final');

-- --------------------------------------------------------

--
-- Estrutura para tabela `challenge`
--

CREATE TABLE `challenge` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `xpReward` int(11) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `conditions` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `challenge`
--

INSERT INTO `challenge` (`id`, `title`, `description`, `type`, `xpReward`, `startDate`, `endDate`, `conditions`) VALUES
(1, 'Desafio Diário', 'Complete 2 tópicos hoje', 'daily', 100, '2025-08-11 02:45:14.654', '2025-08-12 02:45:14.654', '[{\"type\": \"topics_completed\", \"value\": 2}]'),
(2, 'Desafio Semanal', 'Complete 10 tópicos esta semana', 'weekly', 300, '2025-08-11 02:45:14.654', '2025-08-18 02:45:14.654', '[{\"type\": \"topics_completed\", \"value\": 10}]'),
(3, 'Desafio Frontend', 'Complete todos os tópicos de HTML, CSS e JavaScript', 'special', 500, '2025-08-11 02:45:14.654', '2025-09-10 02:45:14.654', '[{\"type\": \"levels_completed\", \"value\": [1, 2, 3, 6]}]'),
(4, 'Desafio Backend', 'Complete todos os tópicos de Node.js, banco de dados e APIs', 'special', 500, '2025-08-11 02:45:14.654', '2025-09-10 02:45:14.654', '[{\"type\": \"levels_completed\", \"value\": [9, 10, 11, 12]}]');

-- --------------------------------------------------------

--
-- Estrutura para tabela `leaderboard`
--

CREATE TABLE `leaderboard` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `leaderboardentry`
--

CREATE TABLE `leaderboardentry` (
  `id` int(11) NOT NULL,
  `leaderboardId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `rank` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `level`
--

CREATE TABLE `level` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `totalXp` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `level`
--

INSERT INTO `level` (`id`, `name`, `totalXp`) VALUES
(1, 'Nível 1 — Fundamentos da Web e da Internet', NULL),
(2, 'Nível 2 — HTML com Maestria', NULL),
(3, 'Nível 3 — CSS do Básico ao Avançado', NULL),
(4, 'Nível 4 — Git, GitHub e Controle de Versão', NULL),
(5, 'Nível 5 — Lógica de Programação e Algoritmos', NULL),
(6, 'Nível 6 — JavaScript com Maestria (Vanilla JS)', NULL),
(7, 'Nível 7 — TypeScript do Zero à Proficiência', NULL),
(8, 'Nível 8 — React (ou Angular/Vue)', NULL),
(9, 'Nível 9 — Node.js com Express', NULL),
(10, 'Nível 10 — Banco de Dados', NULL),
(11, 'Nível 11 — NestJS com TypeScript (Back-End Avançado)', NULL),
(12, 'Nível 12 — APIs RESTful e RESTful Patterns', NULL),
(13, 'Nível 13 — Autenticação e Autorização', NULL),
(14, 'Nível 14 — Deploy e DevOps Básico', NULL),
(15, 'Nível 15 — C# com ASP.NET Core', NULL),
(16, 'Nível 16 — Java com Spring Boot', NULL),
(17, 'Nível 17 — Estrutura de Projetos, Clean Code e Testes', NULL),
(18, 'Nível 18 — Microserviços (Opcional Avançado)', NULL),
(19, 'Nível 19 — Soft Skills e Organização Profissional', NULL),
(20, 'Nível 20 — Inglês Técnico e Profissional', NULL),
(21, 'Nível 21 — Preparação para o Mercado Internacional', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `mentor`
--

CREATE TABLE `mentor` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `expertise` varchar(191) NOT NULL,
  `bio` varchar(191) DEFAULT NULL,
  `rating` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `mentorship`
--

CREATE TABLE `mentorship` (
  `id` int(11) NOT NULL,
  `mentorId` int(11) NOT NULL,
  `menteeId` int(11) NOT NULL,
  `status` varchar(191) NOT NULL,
  `startDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `endDate` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `powerup`
--

CREATE TABLE `powerup` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `effect` varchar(191) NOT NULL,
  `duration` int(11) NOT NULL,
  `cost` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `powerup`
--

INSERT INTO `powerup` (`id`, `name`, `description`, `effect`, `duration`, `cost`) VALUES
(1, 'XP Duplo', 'Ganhe o dobro de XP por 30 minutos', 'double_xp', 30, 100),
(2, 'Pular Nível', 'Pule um nível diretamente', 'skip_level', 0, 500),
(3, 'Dica', 'Receba uma dica para o tópico atual', 'hint', 0, 50);

-- --------------------------------------------------------

--
-- Estrutura para tabela `progress`
--

CREATE TABLE `progress` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `topicId` int(11) NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `completedAt` datetime(3) DEFAULT NULL,
  `difficulty` varchar(191) DEFAULT NULL,
  `startedAt` datetime(3) DEFAULT NULL,
  `timeSpent` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `topic`
--

CREATE TABLE `topic` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `xp` int(11) NOT NULL,
  `levelId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `topic`
--

INSERT INTO `topic` (`id`, `name`, `xp`, `levelId`) VALUES
(1, 'O que é Internet (ISP, IP, DNS, HTTP, HTTPS, etc.)', 30, 1),
(2, 'Como funciona a Web (Cliente, Servidor, Navegador)', 30, 1),
(3, 'HTTP e ciclos de requisição/resposta', 25, 1),
(4, 'Hospedagem, domínios, servidores', 25, 1),
(5, 'Web 1.0, 2.0, 3.0, WebSocket, REST', 20, 1),
(6, 'Front-end vs Back-end vs Full-stack', 20, 1),
(7, 'Estrutura HTML', 25, 2),
(8, 'Tags semânticas', 25, 2),
(9, 'Imagens, links, listas, tabelas, formulários', 30, 2),
(10, 'Acessibilidade', 20, 2),
(11, 'SEO básico', 20, 2),
(12, 'Projetos práticos: currículo, blog, portfólio', 30, 2),
(13, 'Box model, cores, unidades, fontes', 25, 3),
(14, 'Flexbox e Grid', 30, 3),
(15, 'Position, z-index, display', 25, 3),
(16, 'Media queries e responsividade', 25, 3),
(17, 'Animações, transitions', 20, 3),
(18, 'Bootstrap e Tailwind CSS (nível 2 opcional)', 25, 3),
(19, 'Projeto prático: landing page responsiva', 30, 3),
(20, 'Conceitos básicos de versionamento', 20, 4),
(21, 'Comandos Git essenciais', 30, 4),
(22, 'Repositórios, branches, merges, pull requests', 30, 4),
(23, 'GitHub, SSH, .gitignore, forks, issues', 25, 4),
(24, 'Fluxo Git colaborativo (Git Flow)', 25, 4),
(25, 'Variáveis, tipos de dados', 25, 5),
(26, 'Condicionais, loops', 30, 5),
(27, 'Arrays e objetos', 25, 5),
(28, 'Funções e escopos', 30, 5),
(29, 'Estrutura de algoritmos', 25, 5),
(30, 'Exercícios: lógica e resolução de problemas', 35, 5),
(31, 'Sintaxe, operadores, funções', 25, 6),
(32, 'DOM, eventos, manipulação', 30, 6),
(33, 'Arrays, objetos, métodos', 30, 6),
(34, 'Promises, Fetch API', 30, 6),
(35, 'JSON, LocalStorage, ES6+', 25, 6),
(36, 'Projeto prático: To-Do List, SPA simples', 30, 6),
(37, 'Tipagem primitiva, arrays, objetos', 25, 7),
(38, 'Enums, interfaces, type aliases', 30, 7),
(39, 'Classes, generics', 30, 7),
(40, 'Tipagem em funções e async', 25, 7),
(41, 'Integração com projetos JS e React/Nest', 30, 7),
(42, 'Componentes, props, state', 30, 8),
(43, 'Eventos, renderização condicional', 25, 8),
(44, 'Hooks (useState, useEffect, custom hooks)', 35, 8),
(45, 'Context API, Router DOM', 30, 8),
(46, 'Fetch/Axios, chamadas de API', 25, 8),
(47, 'Projeto prático: painel com CRUD e autenticação', 35, 8),
(48, 'Conceito de back-end e servidor web', 20, 9),
(49, 'Node.js e NPM', 25, 9),
(50, 'Express, rotas, middlewares', 30, 9),
(51, 'APIs RESTful', 30, 9),
(52, 'CRUD com arquivos JSON', 25, 9),
(53, 'Projeto prático: API de tarefas', 30, 9),
(54, 'Modelagem relacional (PostgreSQL ou MySQL)', 30, 10),
(55, 'NoSQL (MongoDB básico)', 25, 10),
(56, 'CRUD com SQL e ORM (Prisma/TypeORM)', 35, 10),
(57, 'Relacionamentos e migrations', 30, 10),
(58, 'Conexão Node.js ⇆ banco', 25, 10),
(59, 'Projeto: API completa com banco real', 35, 10),
(60, 'Módulos, controllers, services, decorators', 30, 11),
(61, 'DTOs, Pipes, Guards', 30, 11),
(62, 'Validação com class-validator', 25, 11),
(63, 'Autenticação JWT', 30, 11),
(64, 'Uploads, cache, interceptors', 30, 11),
(65, 'Projeto: API real completa (blog, ecommerce, etc.)', 35, 11),
(66, 'O que é uma API RESTful', 20, 12),
(67, 'Métodos HTTP', 25, 12),
(68, 'Boas práticas de URL', 25, 12),
(69, 'Versionamento, status codes', 25, 12),
(70, 'Teste com Postman/Insomnia', 25, 12),
(71, 'Rate limiting, CORS, segurança básica', 30, 12),
(72, 'Hash de senhas (bcrypt)', 25, 13),
(73, 'JWT e refresh token', 30, 13),
(74, 'Middleware de proteção', 25, 13),
(75, 'RBAC: controle por função', 30, 13),
(76, 'Cookies vs localStorage', 20, 13),
(77, 'Proteção de rotas no front-end', 30, 13),
(78, 'Deploy de front-end (Vercel, Netlify)', 25, 14),
(79, 'Deploy de back-end (Render, Railway, EC2)', 30, 14),
(80, 'Banco em nuvem (Supabase, PlanetScale, Neon)', 25, 14),
(81, 'CI/CD básico com GitHub Actions', 30, 14),
(82, 'Monitoramento e logs', 25, 14),
(83, 'Sintaxe C#, tipos, classes, métodos', 30, 15),
(84, 'ASP.NET Core MVC', 35, 15),
(85, 'Entity Framework', 30, 15),
(86, 'Web APIs em C#', 30, 15),
(87, 'Projeto prático: API .NET com autenticação e banco', 35, 15),
(88, 'Sintaxe Java', 30, 16),
(89, 'Spring Boot: controllers, services, repositories', 35, 16),
(90, 'JPA e Hibernate', 30, 16),
(91, 'Beans, Injeção de Dependência', 30, 16),
(92, 'Projeto prático: API Java com banco de dados', 35, 16),
(93, 'Clean Architecture e SOLID', 30, 17),
(94, 'Separação por camadas', 25, 17),
(95, 'Testes unitários (Jest, JUnit)', 30, 17),
(96, 'Testes de integração', 25, 17),
(97, 'TDD, mocks e stubs', 30, 17),
(98, 'Diferença entre monolito e microserviços', 25, 18),
(99, 'Comunicação via HTTP e mensageria (RabbitMQ)', 30, 18),
(100, 'API Gateway', 25, 18),
(101, 'Docker + containers', 30, 18),
(102, 'Deploy de microserviços', 30, 18),
(103, 'Kanban, Trello, Notion', 20, 19),
(104, 'Comunicação assíncrona', 25, 19),
(105, 'Scrum, sprints, backlog', 30, 19),
(106, 'Trabalho remoto produtivo', 25, 19),
(107, 'Vocabulário de programação em inglês', 25, 20),
(108, 'Treinamento de listening (áudios, vídeos, reuniões)', 30, 20),
(109, 'Como se apresentar, falar de projetos', 25, 20),
(110, 'Entrevistas técnicas: como responder perguntas comuns', 30, 20),
(111, 'Técnicas de speaking: improviso, pronúncia, confiança', 30, 20),
(112, 'Criação de portfólio internacional', 30, 21),
(113, 'GitHub profissional', 25, 21),
(114, 'Como criar um currículo em inglês', 25, 21),
(115, 'Simulação de entrevista (mock interview)', 30, 21),
(116, 'Onde encontrar vagas internacionais (LinkedIn, Turing, VanHack, etc.)', 30, 21);

-- --------------------------------------------------------

--
-- Estrutura para tabela `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `currentStreak` int(11) NOT NULL DEFAULT 0,
  `lastActivityDate` datetime(3) DEFAULT NULL,
  `longestStreak` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `createdAt`, `currentStreak`, `lastActivityDate`, `longestStreak`) VALUES
(1, 'dev@roadmap.com', '$2b$10$wdcz2YrKpOHcxZF6E7M6luPIbiaLehNxV8rAKj5Do3B5jSedaIdKe', '2025-08-11 02:45:14.417', 0, NULL, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `userachievement`
--

CREATE TABLE `userachievement` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `achievementId` int(11) NOT NULL,
  `earnedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `userbadge`
--

CREATE TABLE `userbadge` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `badgeId` int(11) NOT NULL,
  `earnedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `userchallenge`
--

CREATE TABLE `userchallenge` (
  `id` int(11) NOT NULL,
  `challengeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `completedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usercurrency`
--

CREATE TABLE `usercurrency` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `coins` int(11) NOT NULL DEFAULT 0,
  `gems` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('61c8a553-4885-4de6-9a39-5d549579560a', '438c55a403f575db71a17ee828f2403141770dc45fa84a7242ba18a36cabf44b', '2025-08-11 02:45:01.865', '20250804011251_add_total_xp_to_levels', NULL, NULL, '2025-08-11 02:45:01.857', 1),
('9b894dfc-1914-402a-b789-3f42ff9ef518', '85cf4b77ccc08689b0fb697dd2719a6461162ea983534431753f355ada988fa0', '2025-08-11 02:45:01.071', '20250730030627_init', NULL, NULL, '2025-08-11 02:45:00.899', 1),
('e6c36827-3816-4142-96b3-4c65a15ac392', 'ffabf7a7266ea3cca843b916c5dc431db8737fc3c626df5eb1ac7b0fd93c0e43', '2025-08-11 02:45:01.099', '20250731003646_roadmap', NULL, NULL, '2025-08-11 02:45:01.072', 1),
('e7de932a-eeeb-4d62-9e25-6dbcdcfe0231', '21b7ee1b8661d2e4b22607bc1605dab33654811bf4ccffd8630e8a057ad812da', '2025-08-11 02:45:01.116', '20250731022243_remove_xp_needed_from_levels', NULL, NULL, '2025-08-11 02:45:01.100', 1),
('ea8de689-a6de-423f-8ad8-e744dc1cacb2', '467dc8e0c29d71a82e7f3c92086bf0e69fc602d5642871dcf0e10594fa74742b', '2025-08-11 02:45:01.853', '20250803222355_rodapmap', NULL, NULL, '2025-08-11 02:45:01.118', 1);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `achievement`
--
ALTER TABLE `achievement`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `analytics`
--
ALTER TABLE `analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Analytics_userId_fkey` (`userId`);

--
-- Índices de tabela `badge`
--
ALTER TABLE `badge`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `challenge`
--
ALTER TABLE `challenge`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `leaderboardentry`
--
ALTER TABLE `leaderboardentry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `LeaderboardEntry_leaderboardId_fkey` (`leaderboardId`),
  ADD KEY `LeaderboardEntry_userId_fkey` (`userId`);

--
-- Índices de tabela `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Level_name_key` (`name`);

--
-- Índices de tabela `mentor`
--
ALTER TABLE `mentor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Mentor_userId_key` (`userId`);

--
-- Índices de tabela `mentorship`
--
ALTER TABLE `mentorship`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Mentorship_mentorId_fkey` (`mentorId`),
  ADD KEY `Mentorship_menteeId_fkey` (`menteeId`);

--
-- Índices de tabela `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Notification_userId_fkey` (`userId`);

--
-- Índices de tabela `powerup`
--
ALTER TABLE `powerup`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `progress`
--
ALTER TABLE `progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Progress_userId_topicId_key` (`userId`,`topicId`),
  ADD KEY `Progress_topicId_fkey` (`topicId`);

--
-- Índices de tabela `topic`
--
ALTER TABLE `topic`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Topic_levelId_fkey` (`levelId`);

--
-- Índices de tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Índices de tabela `userachievement`
--
ALTER TABLE `userachievement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserAchievement_userId_fkey` (`userId`),
  ADD KEY `UserAchievement_achievementId_fkey` (`achievementId`);

--
-- Índices de tabela `userbadge`
--
ALTER TABLE `userbadge`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserBadge_userId_fkey` (`userId`),
  ADD KEY `UserBadge_badgeId_fkey` (`badgeId`);

--
-- Índices de tabela `userchallenge`
--
ALTER TABLE `userchallenge`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserChallenge_challengeId_fkey` (`challengeId`),
  ADD KEY `UserChallenge_userId_fkey` (`userId`);

--
-- Índices de tabela `usercurrency`
--
ALTER TABLE `usercurrency`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UserCurrency_userId_key` (`userId`);

--
-- Índices de tabela `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `achievement`
--
ALTER TABLE `achievement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de tabela `analytics`
--
ALTER TABLE `analytics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `badge`
--
ALTER TABLE `badge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de tabela `challenge`
--
ALTER TABLE `challenge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `leaderboardentry`
--
ALTER TABLE `leaderboardentry`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `level`
--
ALTER TABLE `level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de tabela `mentor`
--
ALTER TABLE `mentor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `mentorship`
--
ALTER TABLE `mentorship`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=217;

--
-- AUTO_INCREMENT de tabela `powerup`
--
ALTER TABLE `powerup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `progress`
--
ALTER TABLE `progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT de tabela `topic`
--
ALTER TABLE `topic`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `userachievement`
--
ALTER TABLE `userachievement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT de tabela `userbadge`
--
ALTER TABLE `userbadge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `userchallenge`
--
ALTER TABLE `userchallenge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usercurrency`
--
ALTER TABLE `usercurrency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `analytics`
--
ALTER TABLE `analytics`
  ADD CONSTRAINT `Analytics_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `leaderboardentry`
--
ALTER TABLE `leaderboardentry`
  ADD CONSTRAINT `LeaderboardEntry_leaderboardId_fkey` FOREIGN KEY (`leaderboardId`) REFERENCES `leaderboard` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `LeaderboardEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `mentorship`
--
ALTER TABLE `mentorship`
  ADD CONSTRAINT `Mentorship_menteeId_fkey` FOREIGN KEY (`menteeId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Mentorship_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `mentor` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `progress`
--
ALTER TABLE `progress`
  ADD CONSTRAINT `Progress_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `topic` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Progress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `topic`
--
ALTER TABLE `topic`
  ADD CONSTRAINT `Topic_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `level` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `userachievement`
--
ALTER TABLE `userachievement`
  ADD CONSTRAINT `UserAchievement_achievementId_fkey` FOREIGN KEY (`achievementId`) REFERENCES `achievement` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `UserAchievement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `userbadge`
--
ALTER TABLE `userbadge`
  ADD CONSTRAINT `UserBadge_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `badge` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `UserBadge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `userchallenge`
--
ALTER TABLE `userchallenge`
  ADD CONSTRAINT `UserChallenge_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `challenge` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `UserChallenge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `usercurrency`
--
ALTER TABLE `usercurrency`
  ADD CONSTRAINT `UserCurrency_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
