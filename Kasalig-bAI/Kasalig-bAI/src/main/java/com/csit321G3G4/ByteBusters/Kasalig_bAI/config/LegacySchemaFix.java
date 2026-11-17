package com.csit321G3G4.ByteBusters.Kasalig_bAI.config;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Repairs columns that older versions of the code created as NOT NULL but that are optional now.
 * Hibernate's ddl-auto=update only adds columns; it never relaxes an existing one, so without this
 * a teammate's older local database rejects every sign-up with
 * "Invalid data: email may already be used, or a required field is missing."
 *
 * Runs once at startup, after Hibernate has updated the schema. It only changes a column that is
 * still NOT NULL, so on an up-to-date database it does nothing.
 */
@Component
public class LegacySchemaFix implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(LegacySchemaFix.class);

    /** A column that must allow NULL, and its type to keep when NOT NULL is dropped. */
    private record Column(String table, String name, String type) {
    }

    private static final List<Column> NULLABLE_COLUMNS = List.of(
            new Column("student", "year_level", "INT"));

    private final JdbcTemplate jdbc;

    public LegacySchemaFix(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(ApplicationArguments args) {
        for (Column column : NULLABLE_COLUMNS) {
            String table = column.table();
            String name = column.name();
            try {
                List<String> nullable = jdbc.queryForList(
                        "SELECT is_nullable FROM information_schema.columns "
                                + "WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?",
                        String.class, table, name);
                if (nullable.size() == 1 && "NO".equalsIgnoreCase(nullable.get(0))) {
                    jdbc.execute("ALTER TABLE " + table + " MODIFY " + name + " " + column.type() + " NULL");
                    log.info("Made {}.{} optional (it was NOT NULL from an older version of the code).", table, name);
                }
            } catch (RuntimeException ex) {
                // Never stop the app over this; sign-up will report the problem if it remains.
                log.warn("Could not check {}.{}: {}", table, name, ex.getMessage());
            }
        }
    }
}
