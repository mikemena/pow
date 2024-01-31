CREATE TABLE IF NOT EXISTS public.users
(
    user_id serial,
    username character varying NOT NULL,
    email character varying(254) NOT NULL,
    signup_date timestamp without time zone NOT NULL,
    password_hash bytea NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS public.user_exercises
(
    exercise_id serial,
    exercise_name character varying(255) NOT NULL,
    muscle_group_id integer,
    PRIMARY KEY (exercise_id),
    CONSTRAINT "ExerciseID" UNIQUE (exercise_id)
);

CREATE TABLE IF NOT EXISTS public.user_workouts
(
    workout_id serial,
    user_id integer NOT NULL,
    workout_name character varying(255),
    PRIMARY KEY (workout_id)
);

CREATE TABLE IF NOT EXISTS public.user_sets
(
    set_id serial,
    workout_id integer NOT NULL,
    exercise_id integer NOT NULL,
    reps integer,
    weight integer,
    "Notes" text,
    PRIMARY KEY (set_id),
    CONSTRAINT "ExerciseID" UNIQUE (exercise_id)
);

CREATE TABLE IF NOT EXISTS public.exercise_catalog
(
    exercise_id serial,
    exercise_name character varying(255) NOT NULL,
    muscle_group_id integer,
    equipment_id integer,
    exercise_image_id integer,
    PRIMARY KEY (exercise_id)
);

CREATE TABLE IF NOT EXISTS public.image_metadata
(
    image_id serial,
    image_name character varying(255),
    file_path character varying(255),
    file_size bigint,
    content_type character varying(50),
    upload_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    description text,
    checksum character varying(255),
    status character varying(50),
    PRIMARY KEY (image_id)
);

CREATE TABLE IF NOT EXISTS public.workout_history
(
    history_id serial,
    user_id integer NOT NULL,
    workout_id integer NOT NULL,
    workout_date timestamp without time zone NOT NULL,
    duration interval,
    notes text,
    completion_status character varying(50),
    PRIMARY KEY (history_id)
);

CREATE TABLE IF NOT EXISTS public.muscle_groups
(
    muscle_group_id serial,
    muscle_group_name character varying(255) NOT NULL,
    muscle_group_image_id integer,
    PRIMARY KEY (muscle_group_id)
);

CREATE TABLE IF NOT EXISTS public.equipment_catalog
(
    equipment_id serial,
    "equipment_name " character varying(255) NOT NULL,
    equipment_image_id integer,
    PRIMARY KEY (equipment_id)
);

ALTER TABLE IF EXISTS public.user_workouts
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.user_sets
    ADD CONSTRAINT fk_exercise_id FOREIGN KEY (exercise_id)
    REFERENCES public.user_exercises (exercise_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.user_sets
    ADD FOREIGN KEY (workout_id)
    REFERENCES public.user_workouts (workout_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.exercise_catalog
    ADD CONSTRAINT fk_exercise_image_id FOREIGN KEY (exercise_image_id)
    REFERENCES public.image_metadata (image_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.exercise_catalog
    ADD CONSTRAINT fk_muscle_group_id FOREIGN KEY (muscle_group_id)
    REFERENCES public.muscle_groups (muscle_group_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.exercise_catalog
    ADD CONSTRAINT fk_equipment_id FOREIGN KEY (equipment_id)
    REFERENCES public.equipment_catalog (equipment_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.workout_history
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.workout_history
    ADD CONSTRAINT fk_workout_id FOREIGN KEY (workout_id)
    REFERENCES public.user_workouts (workout_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.muscle_groups
    ADD CONSTRAINT fk_muscle_group_image_id FOREIGN KEY (muscle_group_image_id)
    REFERENCES public.image_metadata (image_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.equipment_catalog
    ADD CONSTRAINT fk_equipment_image_id FOREIGN KEY (equipment_image_id)
    REFERENCES public.image_metadata (image_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;