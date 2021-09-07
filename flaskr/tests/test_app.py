import os
import tempfile

import pytest
from flask import json

from ..app import app, db, Cancion

@pytest.fixture
def client():
    print(app)
    db_fd, app.config['DATABASE'] = tempfile.mkstemp()
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            db.init_app(app)
            db.create_all()
        yield client

    os.close(db_fd)
    os.unlink(app.config['DATABASE'])

def test_cancion_a_favorito(client):
    nueva_cancion = Cancion(
            titulo="test",
            minutos="10",
            segundos="30",
            interprete="Test interprete",
            es_favorita=False,
            genero="BALADAS"
            )
    db.session.add(nueva_cancion)
    db.session.commit()

    rv = client.put('/cancion/'+str(nueva_cancion.id)+'/change_favorite_state')
    json_data = json.loads(rv.data)
    assert json_data['es_favorita'] ==  True

    Cancion.query.delete()
    db.session.commit()

def test_quitar_favorito_a_cancion(client):
    nueva_cancion = Cancion(
            titulo="test",
            minutos="10",
            segundos="30",
            interprete="Test interprete",
            es_favorita=True,
            genero="BALADAS"
            )
    db.session.add(nueva_cancion)
    db.session.commit()

    rv = client.put('/cancion/'+str(nueva_cancion.id)+'/change_favorite_state')
    json_data = json.loads(rv.data)
    assert json_data['es_favorita'] == False

    Cancion.query.delete()
    db.session.commit()

def test_agregar_cancion_con_genero_correcto(client):
    data = {
            "titulo": "Test new song",
            "minutos": "10",
            "segundos": "30",
            "interprete": "Test interprete",
            "es_favorita": True,
            "genero": "BALADAS"
            }

    rv = client.post(
            '/canciones',
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
            )
    json_data = json.loads(rv.data)

    assert json_data['titulo'] == data['titulo']
    assert json_data['interprete'] == data['interprete']
    assert json_data['genero']['llave'] == data['genero']

    Cancion.query.delete()
    db.session.commit()

def test_agregar_cancion_con_genero_incorrecto(client):
    data = {
            "titulo": "Test new song",
            "minutos": "10",
            "segundos": "30",
            "interprete": "Test interprete",
            "es_favorita": True,
            "genero": "GENERO_INCORRECTO"
            }

    with pytest.raises(Exception) as execinfo: 
        rv = client.post(
                '/canciones',
                data=json.dumps(data),
                headers={"Content-Type": "application/json"},
                )

    #Assert that is raised and error with correct message 
    assert str(execinfo.value) == "'GENERO_INCORRECTO' is not among the defined enum values. Enum name: genero. Possible values: BACHATA, BALADAS, BANDA, ..., BOLERO"

def test_ver_cancion_detalle(client):
    nueva_cancion = Cancion(
            titulo="test",
            minutos="10",
            segundos="30",
            interprete="Test interprete",
            es_favorita=True,
            genero="BOLERO"
            )
    db.session.add(nueva_cancion)
    db.session.commit()

    rv = client.get('/cancion/'+str(nueva_cancion.id))
    json_data = json.loads(rv.data)
    assert json_data['id'] == nueva_cancion.id
    assert json_data['genero']['llave'] == "BOLERO"

    Cancion.query.delete()
    db.session.commit()

def test_listar_canciones(client):
    nueva_cancion = Cancion(
            titulo="test",
            minutos="10",
            segundos="30",
            interprete="Test interprete",
            es_favorita=True,
            genero="BOLERO"
            )
    db.session.add(nueva_cancion)
    db.session.commit()

    rv = client.get('/canciones')
    json_data = json.loads(rv.data)
    assert json_data[0]['id'] == nueva_cancion.id
    assert json_data[0]['genero']['llave'] == "BOLERO"

    Cancion.query.delete()
    db.session.commit()
