--
-- PostgreSQL database dump
--

\restrict 8Dg7eQTKJKTGNEoeYSYhXIp0VxXomkZxYfOoar6qmrkjGSC0P1aF9WCfOQBRvQr

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ApplicationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApplicationStatus" AS ENUM (
    'PENDING',
    'SHORTLISTED',
    'REJECTED',
    'HIRED'
);


ALTER TYPE public."ApplicationStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Admin" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Admin" OWNER TO postgres;

--
-- Name: Admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Admin_id_seq" OWNER TO postgres;

--
-- Name: Admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Admin_id_seq" OWNED BY public."Admin".id;


--
-- Name: Equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Equipment" (
    id integer NOT NULL,
    name text NOT NULL,
    details text,
    description text,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Equipment" OWNER TO postgres;

--
-- Name: Equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Equipment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Equipment_id_seq" OWNER TO postgres;

--
-- Name: Equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Equipment_id_seq" OWNED BY public."Equipment".id;


--
-- Name: JobApplication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobApplication" (
    id integer NOT NULL,
    "jobId" integer NOT NULL,
    "appliedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email text NOT NULL,
    "fullName" text NOT NULL,
    "phoneNo" text NOT NULL,
    wswhy text,
    resume text NOT NULL,
    status public."ApplicationStatus" DEFAULT 'PENDING'::public."ApplicationStatus" NOT NULL
);


ALTER TABLE public."JobApplication" OWNER TO postgres;

--
-- Name: JobApplication_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JobApplication_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JobApplication_id_seq" OWNER TO postgres;

--
-- Name: JobApplication_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JobApplication_id_seq" OWNED BY public."JobApplication".id;


--
-- Name: JobOpening; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobOpening" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "postedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    salary integer,
    requirements text[]
);


ALTER TABLE public."JobOpening" OWNER TO postgres;

--
-- Name: JobOpening_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JobOpening_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JobOpening_id_seq" OWNER TO postgres;

--
-- Name: JobOpening_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JobOpening_id_seq" OWNED BY public."JobOpening".id;


--
-- Name: Process; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Process" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    highlights text[],
    icon text
);


ALTER TABLE public."Process" OWNER TO postgres;

--
-- Name: Process_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Process_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Process_id_seq" OWNER TO postgres;

--
-- Name: Process_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Process_id_seq" OWNED BY public."Process".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    img text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Product_id_seq" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: Staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Staff" (
    id integer NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Staff" OWNER TO postgres;

--
-- Name: Staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Staff_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Staff_id_seq" OWNER TO postgres;

--
-- Name: Staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Staff_id_seq" OWNED BY public."Staff".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin" ALTER COLUMN id SET DEFAULT nextval('public."Admin_id_seq"'::regclass);


--
-- Name: Equipment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment" ALTER COLUMN id SET DEFAULT nextval('public."Equipment_id_seq"'::regclass);


--
-- Name: JobApplication id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobApplication" ALTER COLUMN id SET DEFAULT nextval('public."JobApplication_id_seq"'::regclass);


--
-- Name: JobOpening id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobOpening" ALTER COLUMN id SET DEFAULT nextval('public."JobOpening_id_seq"'::regclass);


--
-- Name: Process id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Process" ALTER COLUMN id SET DEFAULT nextval('public."Process_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: Staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Staff" ALTER COLUMN id SET DEFAULT nextval('public."Staff_id_seq"'::regclass);


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Admin" (id, email, password, "isActive", "createdAt") FROM stdin;
1	umestaditya72@gmail.com	$2b$10$s83kEIEb7UC/CnVbSnASjOndSYRXdjxuosMJXjM6RYOeukSa//f.K	t	2026-01-30 11:00:33.98
\.


--
-- Data for Name: Equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Equipment" (id, name, details, description, image, "createdAt") FROM stdin;
6	10 Ton OH Crane	Overhead cranes with 10-ton capacity each for heavy material handling.	Our facility houses overhead cranes with a 10-ton lifting capacity each, ensuring safe and efficient handling of heavy structural components during fabrication and assembly.	equipments/1769776665304.webp	2026-01-30 12:37:45.466
7	Shot Blasting Booth	State-of-the-art 10m × 5m blast booth for surface preparation.	The 10m × 5m shot blasting booth is designed for superior surface cleaning, removing rust, scale, and other impurities, ensuring material readiness for further processing.	equipments/1769776665480.webp	2026-01-30 12:37:45.482
8	Paint Booth	Advanced 10m × 5m booth with bottom suction paper filter for smooth coating.	Equipped with bottom suction and paper filter technology, the paint booth ensures flawless finishing, consistent coating quality, and a dust-free environment for industrial painting.	equipments/1769776665487.webp	2026-01-30 12:37:45.49
9	Plasma Machine	3m × 14m effective cutting machine with Hypertherm power source.	Highly accurate cutting on large plates up to 14m in length, enabling complex profile cutting with high precision and efficiency.	equipments/1769776665496.webp	2026-01-30 12:37:45.498
10	Rolling Machine	2.1m × 10mm thick capacity, 4-roll machine from Akyapak, Turkey.	Capable of rolling steel plates up to 2.1m wide and 10mm thick for cylindrical and conical components.	equipments/1769776665504.webp	2026-01-30 12:37:45.51
\.


--
-- Data for Name: JobApplication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobApplication" (id, "jobId", "appliedAt", email, "fullName", "phoneNo", wswhy, resume, status) FROM stdin;
\.


--
-- Data for Name: JobOpening; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobOpening" (id, title, description, "isActive", "postedAt", salary, requirements) FROM stdin;
\.


--
-- Data for Name: Process; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Process" (id, name, description, "createdAt", highlights, icon) FROM stdin;
1	Cutting & Shaping	Plasma cutting, laser cutting, and CNC machining for accurate component sizing.	2026-01-30 10:53:53.459	{"Plasma cutting up to 10mm thick","High-precision cutting with minimal material wastage"}	fa-cut
2	Welding & Joining	Expert welding services using MIG, TIG, and Arc welding processes with certified welders.	2026-01-30 10:53:53.464	{"AWS certified welders","Structural and pressure vessel welding"}	fa-fire
3	Forming & Bending	Advanced press brakes and forming equipment for precise metal shaping and bending operations.	2026-01-30 10:53:53.466	{"1000-ton press brake capacity","10m forming length"}	fa-hammer
4	Surface Finishing	Professional spray painting and painting services in our automotive-grade paint booth.	2026-01-30 10:53:53.467	{"Spray painting capabilities","Liquid paint applications"}	fa-spray-can
5	Assembly & Integration	Complete assembly services with precision fitting and integration of complex components.	2026-01-30 10:53:53.468	{"Mechanical assembly","Hardware installation"}	fa-tools
6	Quality Control	Rigorous inspection and testing procedures to ensure every product meets specifications.	2026-01-30 10:53:53.469	{"Non-destructive testing","Material verification"}	fa-search
7	Cutting & Shaping	Plasma cutting, laser cutting, and CNC machining for accurate component sizing.	2026-01-30 11:19:11.613	{"Plasma cutting up to 10mm thick","High-precision cutting with minimal material wastage"}	fa-cut
8	Welding & Joining	Expert welding services using MIG, TIG, and Arc welding processes with certified welders.	2026-01-30 11:19:11.623	{"AWS certified welders","Structural and pressure vessel welding"}	fa-fire
9	Forming & Bending	Advanced press brakes and forming equipment for precise metal shaping and bending operations.	2026-01-30 11:19:11.625	{"1000-ton press brake capacity","10m forming length"}	fa-hammer
10	Surface Finishing	Professional spray painting and painting services in our automotive-grade paint booth.	2026-01-30 11:19:11.626	{"Spray painting capabilities","Liquid paint applications"}	fa-spray-can
11	Assembly & Integration	Complete assembly services with precision fitting and integration of complex components.	2026-01-30 11:19:11.627	{"Mechanical assembly","Hardware installation"}	fa-tools
12	Quality Control	Rigorous inspection and testing procedures to ensure every product meets specifications.	2026-01-30 11:19:11.628	{"Non-destructive testing","Material verification"}	fa-search
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, description, img, "createdAt") FROM stdin;
21	Coal Washing Jig - Mining Equipment	High-efficiency coal washing jig engineered for mineral processing plants, improving coal quality through precise gravity separation and reduced ash content.	products/1769786363255.webp	2026-01-30 15:19:23.301
22	Distribution Piping - Hydro Power Project	Precision-fabricated distribution piping systems designed to handle high-pressure water flow in hydroelectric power projects.	products/1769786363319.webp	2026-01-30 15:19:23.322
23	Bin Frame 4x6 - Batching Plant	Heavy-duty structural bin frame manufactured for concrete batching plants, ensuring superior load-bearing strength and dimensional accuracy.	products/1769786363326.webp	2026-01-30 15:19:23.329
24	Bin Frames - Concrete Batching Plant	Industrial-grade bin frames fabricated for aggregate storage in batching plants, offering long service life and high structural stability.	products/1769786363334.webp	2026-01-30 15:19:23.339
25	Aggregates and Stone Crusher Components	Robust fabricated components for stone crushers and aggregate processing plants, designed for continuous operation in harsh mining environments.	products/1769786363347.webp	2026-01-30 15:19:23.351
26	Rake Mechanism - Thickener Equipment	Precision-engineered rake mechanisms used in mining thickeners, ensuring efficient sludge movement and sediment discharge.	products/1769786363356.webp	2026-01-30 15:19:23.358
27	Draft Tube - Hydro Power Project	Custom-fabricated draft tubes engineered for hydroelectric plants to optimize water discharge and turbine efficiency.	products/1769786363363.webp	2026-01-30 15:19:23.365
28	Feed Box - Mining Feed Well	Heavy-duty feed boxes designed for uniform slurry distribution in mining feed wells and thickener systems.	products/1769786363370.webp	2026-01-30 15:19:23.372
29	Thickener Feed Well - Iron Ore Mining	Engineered feed wells for iron ore thickeners, enabling controlled slurry entry and enhanced settling performance.	products/1769786363377.webp	2026-01-30 15:19:23.381
30	Bridge Structure - Thickener	Structural steel bridges manufactured for mining thickeners, providing stable support for drive mechanisms and maintenance access.	products/1769786363386.webp	2026-01-30 15:19:23.389
\.


--
-- Data for Name: Staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Staff" (id, name, role, image, "createdAt", "updatedAt") FROM stdin;
1	Mr. Duryodhan Yadav	Plant Head	1770125045584.jpeg	2026-02-03 13:24:05.782	2026-02-03 13:24:05.782
3	Mr. Suresh Babu	Head - Accounts	1770125373075.jpeg	2026-02-03 13:29:33.217	2026-02-03 13:29:33.217
4	Mr. Umesh Patil	Managing Partner	1770125500266.jpeg	2026-02-03 13:31:40.295	2026-02-03 13:31:40.295
5	Mr. Shanmugan	Plant Advisor	1770181115110.jpeg	2026-02-04 04:58:35.216	2026-02-04 04:58:35.216
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
5bfbb680-1654-403a-bcc8-70f84a7738d1	eb8bc261867f213c5075f9dabf4c2c526df1cc5c2329751f405261f930c61ece	2026-01-31 14:04:02.530138+05:30	20260131083402_staff	\N	\N	2026-01-31 14:04:02.51902+05:30	1
79d6afc2-6156-43b0-98bd-cec241c73205	ea4b401bc9994919d313e010dbcf256e5096af717239b9d9aadfa2d991ebc707	2026-01-30 16:19:45.264632+05:30	20250818061455_new	\N	\N	2026-01-30 16:19:45.238829+05:30	1
bb0a8b52-08ae-4544-8e1c-64a28f4b1905	1cd21e8cf034e9cfcbf85ff489c2e9b575444cf6d70cdbf7c35a3fb47110f1b8	2026-01-30 16:19:45.269775+05:30	20250818061628_new	\N	\N	2026-01-30 16:19:45.265448+05:30	1
bbb40bb4-6a76-4347-a53c-4f195044f59c	61e6f827e317b8b2c271be2d93add11788f6df0ff4a6b6feea146dcb740b9ed6	2026-01-30 16:19:45.271788+05:30	20251024065423_dev	\N	\N	2026-01-30 16:19:45.270229+05:30	1
bd86191f-814a-4af5-a30f-000d96a7fb4d	450805a610d953670880579a52f2b187b3a94f6ba3b8c2a5fde9c2f4759215ee	2026-01-30 16:19:45.279375+05:30	20251024203237	\N	\N	2026-01-30 16:19:45.272124+05:30	1
3a9da0da-671d-401e-855a-5b89a94b90cd	ef9359af06567ac42d73f5a4f49a2fb89a9933df0125fc54a7d7e3e3dcb8bd3e	2026-01-30 16:19:45.294644+05:30	20251223221744_db	\N	\N	2026-01-30 16:19:45.279791+05:30	1
43271093-9c9a-464f-b51f-4274d7a67695	dc458ba285c56bd801f6bfd659ce4f985c8d6f377cb46911f1609d86abaa5a1d	2026-01-30 16:19:45.297493+05:30	20260104094516_added_some_job_openeing_reqs	\N	\N	2026-01-30 16:19:45.295205+05:30	1
513126c7-27d1-4b02-89bc-4df312fe2abc	9212e490bd5c3644efa1fd0c0ab59ac4c1b9e5c0f341a95513638f4148733411	2026-01-30 16:19:45.302682+05:30	20260129181659	\N	\N	2026-01-30 16:19:45.298156+05:30	1
d136cc63-f39f-4257-b1dd-af0c79749df5	ab775edfa42e6901686e2dae4bcab6dfc146391fa2c98eee53b3bf73e08295a9	2026-01-30 16:19:45.306117+05:30	20260129182245_removed_type_and_added_created_at	\N	\N	2026-01-30 16:19:45.303191+05:30	1
5e571568-f34e-4858-b37a-d7a6dc2bb15e	aea57323d1d5840c69f28c7e1956088288f7b98f416238159c90580b4b7082bb	2026-01-30 16:19:45.308348+05:30	20260129193603_changed_the_process_schema	\N	\N	2026-01-30 16:19:45.306621+05:30	1
b3fd3740-5d94-45fb-b145-a1a83e01ecdc	ead207a5a3409a9dca99e5df7fdda3e105d99a71f2442565411dbabf8b3d7d91	2026-01-30 16:19:45.309797+05:30	20260129195148_dev	\N	\N	2026-01-30 16:19:45.308691+05:30	1
e971efb5-e6b3-4ea0-b2e2-f7142527600e	2fbd46c048fc168c0c0fa5c783aec5155535009fadfa3e4a3e0cdbc17c203ae0	2026-01-30 16:19:51.106824+05:30	20260130104951_dev	\N	\N	2026-01-30 16:19:51.096144+05:30	1
6e7cf0f1-48f7-477b-9068-a58e5208cfba	dae3652d4f38d82b629612f00e665d038e4fd8e466079bed9a049d213c77693d	2026-01-30 23:15:44.597722+05:30	20260130174544_changed_openeings_schema	\N	\N	2026-01-30 23:15:44.594165+05:30	1
cee5e306-2c61-4952-a199-b18447edb1ce	ed7518e9f39492e6b4eaa13bcc513b7c9a83759962266162323c7b7d8297d988	2026-01-31 00:17:01.16944+05:30	20260130184701_edit_name_in_opening	\N	\N	2026-01-31 00:17:01.15673+05:30	1
\.


--
-- Name: Admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Admin_id_seq"', 1, true);


--
-- Name: Equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Equipment_id_seq"', 10, true);


--
-- Name: JobApplication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."JobApplication_id_seq"', 3, true);


--
-- Name: JobOpening_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."JobOpening_id_seq"', 5, true);


--
-- Name: Process_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Process_id_seq"', 12, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 30, true);


--
-- Name: Staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Staff_id_seq"', 5, true);


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: Equipment Equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT "Equipment_pkey" PRIMARY KEY (id);


--
-- Name: JobApplication JobApplication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_pkey" PRIMARY KEY (id);


--
-- Name: JobOpening JobOpening_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobOpening"
    ADD CONSTRAINT "JobOpening_pkey" PRIMARY KEY (id);


--
-- Name: Process Process_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Process"
    ADD CONSTRAINT "Process_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Staff Staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Staff"
    ADD CONSTRAINT "Staff_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Admin_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Admin_email_key" ON public."Admin" USING btree (email);


--
-- Name: JobApplication_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "JobApplication_email_idx" ON public."JobApplication" USING btree (email);


--
-- Name: JobApplication_jobId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "JobApplication_jobId_idx" ON public."JobApplication" USING btree ("jobId");


--
-- Name: JobApplication JobApplication_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."JobOpening"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 8Dg7eQTKJKTGNEoeYSYhXIp0VxXomkZxYfOoar6qmrkjGSC0P1aF9WCfOQBRvQr

