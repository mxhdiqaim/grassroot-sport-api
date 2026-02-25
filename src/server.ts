import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { swagger } from '@elysiajs/swagger';
import { getEnvVariable } from "./utils";
// import { routes } from "./routes"; // We'll convert your routes to Elysia modules

const NODE_ENV = getEnvVariable("NODE_ENV");
const LANDING_PAGE = getEnvVariable("LANDING_PAGE");
const APP_URL = getEnvVariable("APP_URL");

export const app = new Elysia()
    // Built-in Swagger (Replaces manual API docs)
    .use(swagger())

    // Performance-optimised CORS
    .use(cors({
        origin: NODE_ENV === "development"
            ? [/localhost:300[0-2]/]
            : [LANDING_PAGE, APP_URL],
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
    }))

    // Static Files (Replaces express.static)
    .use(staticPlugin({
        assets: 'public',
        prefix: '/public'
    }))

    // Global State & Context (Replaces custom req/res mutation)
    .derive(({ headers }) => {
        return {
            authorization: headers['authorization']
        };
    })

    // Your API Routes
    .group('/api/v1', (app) => app
        // Example Route: Go Live
        .post('/matches/:id/go-live', ({ params }) => {
            return { message: `Match ${params.id} is now live!` };
        }, {
            params: t.Object({ id: t.Numeric() }) // Built-in validation!
        })
    )

    // Global Error Handling
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404;
            return { message: "Route not found" };
        }
        console.error(error);
        return { message: "Internal server error" };
    });